import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const [apk, buildCommit] = process.argv.slice(2);
const appId = process.env.FIREBASE_APP_ID;
const tester = process.env.PROFESSOR_EMAIL;
if (!apk || !existsSync(resolve(apk)) || !apk.endsWith('.apk')) throw new Error('Informe o APK existente como primeiro argumento.');
if (!appId || !tester || !tester.includes('@')) throw new Error('Defina FIREBASE_APP_ID e PROFESSOR_EMAIL antes de distribuir.');
const commit = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
if (commit !== buildCommit) throw new Error('O hash informado deve ser o mesmo da tela Sobre e do HEAD entregue.');
if (execFileSync('git', ['status', '--porcelain'], { encoding: 'utf8' }).trim()) throw new Error('Finalize as alterações do repositório antes de distribuir.');
const args = ['appdistribution:distribute', resolve(apk), '--app', appId, '--testers', tester, '--release-notes', `Dobu Sprint 4 | commit ${commit}`];
execFileSync(process.platform === 'win32' ? 'firebase.cmd' : 'firebase', args, { stdio: 'inherit', shell: process.platform === 'win32' });
