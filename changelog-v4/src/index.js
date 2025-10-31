'use strict';
// forked: https://github.com/antfu/changelogithub/blob/main/src/cli.ts
const core = require('@actions/core');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

function log(message) {
  core.info(message);
}

async function runWithProgrammaticAPI() {
  // changelogithub is ESM; use dynamic import so ncc can include it
  const mod = await import('changelogithub');
  const {
    generate,
    hasTagOnGitHub,
    isRepoShallow,
    sendRelease,
    uploadAssets
  } = mod;

  if (typeof generate !== 'function') {
    throw new Error('changelogithub.generate is not available; unexpected package shape');
  }

  // Follow CLI behavior: pass token via args, other options由工具内部解析（git、env、配置文件）
  const { config, md, commits } = await generate({ token: process.env.GITHUB_TOKEN });

  if (!config.token) {
    throw new Error('No GitHub token found, specify it via GITHUB_TOKEN env.');
  }

  if (typeof hasTagOnGitHub === 'function') {
    const ok = await hasTagOnGitHub(config.to, config);
    if (!ok) {
      throw new Error(`Current ref "${String(config.to)}" is not available as tags on GitHub.`);
    }
  }

  if (typeof isRepoShallow === 'function') {
    const shallow = await isRepoShallow();
    if (!commits.length && shallow) {
      throw new Error('The repo seems to be clone shallowly. You might want to specify fetch-depth: 0 in your CI config.');
    }
  }

  // 发送 Release（与 CLI 保持一致的核心行为）
  if (typeof sendRelease !== 'function') {
    throw new Error('changelogithub.sendRelease is not available; unexpected package shape');
  }
  const release = await sendRelease(config, md);

  // assets 可选（Action 未暴露该输入，若有内部配置则尝试上传）
  if (config.assets && Array.isArray(config.assets) && config.assets.length > 0 && typeof uploadAssets === 'function') {
    await uploadAssets(config, config.assets, release);
  }
}

async function main() {
  const token = core.getInput('token', { required: true });
  const allowFailureInput = core.getInput('allow-failure') || 'true';
  const allowFailure = !(String(allowFailureInput).toLowerCase() === 'false');

  // Validate git environment
  log('🔎 Validating git environment...');
  try {
    const gitCmd = process.platform === 'win32' ? 'git.exe' : 'git';
    const res = spawnSync(gitCmd, ['--version'], { stdio: 'ignore' });
    if (res.status !== 0) throw new Error('git not available');
    log('✅ Git environment validation passed');
  } catch (_) {
    core.warning('❌ git is not installed or not in PATH');
    if (!allowFailure) {
      core.setFailed('❌ Exiting because allow-failure is set to false');
      return;
    }
    log('ℹ️ Continuing despite missing git because allow-failure is true');
  }

  // Prepare npm cache directory (mirrors composite behavior; no cache action in JS)
  try {
    const homeDir = process.env.HOME || process.env.USERPROFILE || '';
    if (homeDir) {
      const npmDir = path.join(homeDir, '.npm');
      fs.mkdirSync(npmDir, { recursive: true });
    }
  } catch (_) {
    // ignore cache dir errors
  }

  const workspace = process.env.GITHUB_WORKSPACE || process.cwd();

  // Provide token to changelogithub
  process.env.GITHUB_TOKEN = token;

  // Ensure running inside repository workspace
  try {
    process.chdir(workspace);
  } catch (_) {
    // ignore chdir errors, will run in current working directory
  }

  log('🚀 Running changelogithub (bundled, programmatic API) in repository workspace...');
  log(`📂 Working directory: ${process.cwd()}`);
  log(`🔐 Token provided: ${process.env.GITHUB_TOKEN ? 'yes' : 'no'}`);
  log(`📌 Repo context: GITHUB_REPOSITORY=${process.env.GITHUB_REPOSITORY || ''}, GITHUB_REF=${process.env.GITHUB_REF || ''}`);

  try {
    await runWithProgrammaticAPI();

    core.setOutput('changelog_created', 'true');
    log('✅ Changelog created successfully');
  } catch (err) {
    core.setOutput('changelog_created', 'false');
    const msg = err && err.message ? err.message : String(err);
    core.warning(`⚠️ Failed to create changelog: ${msg}`);
    if (err && err.stack) core.info(err.stack);
    if (!allowFailure) {
      core.setFailed(`❌ Exiting because allow-failure is set to false: ${msg}`);
      return;
    }
    log('ℹ️ Continuing despite failure because allow-failure is true');
  }
}

main().catch((err) => {
  core.setOutput('changelog_created', 'false');
  core.setFailed(err && err.message ? err.message : String(err));
});