import {cp,copyFile,mkdir,rm,readFile,writeFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {fileURLToPath} from 'node:url';

const base=resolve(fileURLToPath(new URL('..',import.meta.url)));
const out=join(base,'native','www');
const nativeAssets=join(base,'native','assets');
const files=['index.html','verify.html','styles.css','emr.css','app.js','runtime.js','product-policy.js','native-print.js','native-biometric.js','emr-core.js','emr.js','cloud.js','secure-sync.js','clinical-assistant.js','quick-note.js','supabase-config.js','qr.js','verify.js','manifest.webmanifest','icd10-mx-inegi-2025.json'];
await rm(out,{recursive:true,force:true});await mkdir(out,{recursive:true});
for(const name of files)await copyFile(join(base,name),join(out,name));
await cp(join(base,'icons'),join(out,'icons'),{recursive:true});
await cp(join(base,'assets'),join(out,'assets'),{recursive:true});
const index=join(out,'index.html');
await writeFile(join(out,'preview-mode.js'),"window.ClinovyraNativePreview=true;\n");
await writeFile(index,(await readFile(index,'utf8')).replace('</head>','<script src="preview-mode.js"></script></head>'));
await mkdir(nativeAssets,{recursive:true});
await copyFile(join(base,'icons','clinovyra.png'),join(nativeAssets,'logo.png'));
console.log(`Clinovyra native bundle: ${files.length} files plus brand assets`);
