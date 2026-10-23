import {spawnSync} from 'node:child_process';
import fs from 'node:fs/promises';
const credentials=spawnSync('git',['credential','fill'],{input:'protocol=https\nhost=github.com\n\n',encoding:'utf8',windowsHide:true,env:{...process.env,GIT_TERMINAL_PROMPT:'0',GCM_INTERACTIVE:'never'}});
if(credentials.status!==0){console.log(JSON.stringify({authenticated:false,message:'Git credential manager did not return stored access'}));process.exit(1)}
const fields=Object.fromEntries(credentials.stdout.trim().split('\n').map(line=>{const i=line.indexOf('=');return[line.slice(0,i),line.slice(i+1)]}));
const headers={'User-Agent':'MiBank-site-deployment','Accept':'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28','Authorization':'Bearer '+fields.password};
const endpoint=process.argv[2]||'/repos/jay-rtl/mibank';const method=process.argv[3]||'GET';const body=process.argv[4]?JSON.parse(process.argv[4].startsWith('@')?await fs.readFile(process.argv[4].slice(1),'utf8'):process.argv[4]):undefined;
const r=await fetch('https://api.github.com'+endpoint,{method,headers,body:body?JSON.stringify(body):undefined});const data=await r.json().catch(()=>({}));
function safe(value){if(Array.isArray(value))return value.map(safe);if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).filter(([key])=>!/token|password|secret|email/i.test(key)).map(([key,v])=>[key,safe(v)]));return value}
const summary=endpoint.includes('/actions/runs')&&data.workflow_runs?{total_count:data.total_count,runs:data.workflow_runs.map(run=>({id:run.id,sha:run.head_sha,status:run.status,conclusion:run.conclusion,url:run.html_url}))}:endpoint.endsWith('/jobs')&&data.jobs?{jobs:data.jobs.map(job=>({id:job.id,name:job.name,status:job.status,conclusion:job.conclusion,steps:job.steps.map(step=>({name:step.name,status:step.status,conclusion:step.conclusion}))}))}:safe(data);
console.log(JSON.stringify({httpStatus:r.status,...summary},null,2));if(!r.ok)process.exitCode=1;
