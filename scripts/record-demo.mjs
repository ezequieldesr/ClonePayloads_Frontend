import {spawnSync} from 'node:child_process';
import {readdirSync,mkdirSync,copyFileSync,readFileSync,writeFileSync} from 'node:fs';
const result=spawnSync(process.execPath,['node_modules/@playwright/test/cli.js','test'],{stdio:'inherit',env:{...process.env,DEMO:'1'}});
if(result.status!==0)process.exit(result.status||1);
const dir=readdirSync('test-results',{withFileTypes:true}).find(d=>d.isDirectory()&&d.name.includes('Jornada'));
if(!dir)throw Error('Gravação da jornada não encontrada');mkdirSync('docs/demo',{recursive:true});copyFileSync(`test-results/${dir.name}/video.webm`,'docs/demo/clonepayloads-demo.webm');
const report=JSON.parse(readFileSync('test-results/results.json','utf8'));const tests=[];function walk(s){for(const spec of s.specs||[])tests.push({name:spec.title,passed:spec.ok});for(const child of s.suites||[])walk(child);}for(const s of report.suites)walk(s);writeFileSync('docs/demo/verification.json',JSON.stringify({recordedAt:new Date().toISOString(),tests},null,2));
console.log('Vídeo: docs/demo/clonepayloads-demo.webm');
