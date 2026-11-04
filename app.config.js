const { execFileSync } = require('node:child_process');
const { expo } = require('./app.json');

module.exports = () => {
  let commit = process.env.EAS_BUILD_GIT_COMMIT_HASH;
  if (!commit) {
    try { commit = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(); }
    catch { commit = ''; }
  }
  if (commit && !/^[a-f0-9]{40}$/i.test(commit)) throw new Error('Hash do build inválido.');
  return { ...expo, extra: { ...expo.extra, buildCommit: commit || 'desenvolvimento' } };
};
