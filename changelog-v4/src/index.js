'use strict';

const core = require('@actions/core');
const fs = require('fs');
const path = require('path');

function log(message) {
  core.info(message);
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

  const workspace = process.env.GITHUB_WORKSPACE || process.cwd();

  // Provide token to changelogithub
  process.env.GITHUB_TOKEN = token;

  // Ensure running inside repository workspace
  try {
    process.chdir(workspace);
  } catch (_) {
    // ignore chdir errors, will run in current working directory
  }

  log('🚀 Running changelogithub (bundled) in repository workspace...');
  log(`📂 Working directory: ${process.cwd()}`);

  try {
    // Static import specifier for ncc to include ESM CLI into the bundle
    await import('changelogithub/cli.mjs');

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