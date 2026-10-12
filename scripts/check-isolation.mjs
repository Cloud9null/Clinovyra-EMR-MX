import {readFileSync, readdirSync} from 'node:fs';
import {join} from 'node:path';
const excluded=new Set(['.git','node_modules','dist','www','out','.next','test-results','playwright-report']);
const forbidden=[new RegExp(['aqugdz','qvfqrb','vzjqdoef'].join(''),'i'),new RegExp(['rx-offline-medical-prescription','\\.vercel\\.app'].join(''),'i'),new RegExp(['Heron',' Ramirez'].join(''),'i'),new RegExp(['Universidad del Valle',' de Mexico'].join(''),'i'),new RegExp(['sb_','secret_'].join(''),'i'),/service_role\s*[:=]\s*['"][^'"]+/i];
const files=[];
function walk(dir){for(const entry of readdirSync(dir,{withFileTypes:true})){if(excluded.has(entry.name))continue;const p=join(dir,entry.name);if(entry.isDirectory())walk(p);else if(entry.isFile())files.push(p)}}
walk('.');
const problems=[];
for(const file of files){const body=readFileSync(file);if(body.includes(0))continue;const content=body.toString('utf8');for(const pattern of forbidden)if(pattern.test(content))problems.push(`${file}: ${pattern}`)}
const config=readFileSync('supabase-config.js','utf8');
if(!/url:\s*''/.test(config)||!/publishableKey:\s*''/.test(config))problems.push('Client cloud config must fail closed until provisioned');
const api=readFileSync('api/clinical-note.js','utf8');
if(!api.includes('IA Premium no habilitada')||!/statusCode=req\.method==='POST'\?503/.test(api)||/\/auth\/v1\/user/.test(api))problems.push('Clinical API must fail closed without personal Auth');
if(problems.length){console.error(problems.join('\n'));process.exit(1)}
console.log(`Isolation scan passed (${files.length} files).`);
