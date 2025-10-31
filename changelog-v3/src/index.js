'use strict';

const core = require('@actions/core');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

function log(message) {
  core.info(message);
}

function runCmd(cmd, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      stdio: 'inherit',
      ...options
    });
    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} exited with code ${code}`));
    });
  });
}

async function main() {
  const token = core.getInput('token', { required: true });
  const allowFailureInput = core.getInput('allow-failure') || 'true';
  const allowFailure = !(String(allowFailureInput).toLowerCase() === 'false');

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

  const actionPath = process.env.GITHUB_ACTION_PATH || path.resolve(__dirname, '..');
  const workspace = process.env.GITHUB_WORKSPACE || process.cwd();

  log('📦 Installing project dependencies...');
  log(`📂 Action directory: ${actionPath}`);

  const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  try {
    const hasLock = fs.existsSync(path.join(actionPath, 'package-lock.json'));
    await runCmd(npmCmd, [hasLock ? 'ci' : 'install', '--no-fund', '--no-audit'], { cwd: actionPath });
    log('✅ Dependencies installed');
    log('🔎 Installed changelogithub version:');
    await runCmd(npmCmd, ['ls', 'changelogithub', '--depth=0'], { cwd: actionPath });
  } catch (err) {
    core.warning('❌ Failed to install dependencies');
    if (!allowFailure) {
      core.setFailed('❌ Exiting because allow-failure is set to false');
      return;
    }
    log('ℹ️ Continuing despite install failure because allow-failure is true');
  }

  // Run changelogithub in repo workspace
  log('🚀 Running changelogithub in repository workspace...');
  log(`📂 Working directory: ${workspace}`);

  const env = { ...process.env, GITHUB_TOKEN: token };
  const cliBin = process.platform === 'win32' ? 'changelogithub.cmd' : 'changelogithub';
  const cliPath = path.join(actionPath, 'node_modules', '.bin', cliBin);

  log(`🧰 Using changelogithub from: ${cliPath}`);

  try {
    await runCmd(cliPath, [], { cwd: workspace, env });
    core.setOutput('changelog_created', 'true');
    log('✅ Changelog created successfully');
  } catch (err) {
    core.setOutput('changelog_created', 'false');
    core.warning('⚠️ Failed to create changelog');
    if (!allowFailure) {
      core.setFailed(`❌ Exiting because allow-failure is set to false: ${err && err.message ? err.message : String(err)}`);
      return;
    }
    log('ℹ️ Continuing despite failure because allow-failure is true');
  }
}

main().catch((err) => {
  core.setOutput('changelog_created', 'false');
  core.setFailed(err && err.message ? err.message : String(err));
});