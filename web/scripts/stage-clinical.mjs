import { cp, copyFile, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, join } from 'node:path';

// The root client is also the native app UI. Keep one implementation in Git.
const root = resolve(fileURLToPath(new URL('../..', import.meta.url)));
const out = join(root, 'web', 'public', 'clinical');
const live = join(root, 'web', 'public', 'workspace');
const files = [
  'index.html', 'styles.css', 'emr.css', 'app.js', 'runtime.js',
  'product-policy.js', 'native-print.js', 'native-biometric.js',
  'emr-core.js', 'emr.js', 'cloud.js', 'secure-sync.js',
  'clinical-assistant.js', 'quick-note.js', 'supabase-config.js',
  'qr.js', 'manifest.webmanifest', 'icd10-mx-inegi-2025.json'
];

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
for (const file of files) await copyFile(join(root, file), join(out, file));
await cp(join(root, 'icons'), join(out, 'icons'), { recursive: true });
await cp(join(root, 'assets'), join(out, 'assets'), { recursive: true });
await rm(live, { recursive: true, force: true });
await cp(out, live, { recursive: true });

const index = join(out, 'index.html');
const html = await readFile(index, 'utf8');
if (!html.includes('</head>')) throw new Error('Clinical page is missing </head>');
await writeFile(join(out, 'web-demo.js'),
  'window.ClinovyraWebDemo=true;window.ClinovyraNativePreview=true;document.documentElement.classList.add("web-demo");\n');
await writeFile(join(out, 'web-demo.css'), `
.web-demo .session-card,
.web-demo .danger-zone,
.web-demo .cloud-card .owner-access-banner,
.web-demo #exportBackupBtn,
.web-demo .file-btn,
.web-demo #enableBiometricBtn,
.web-demo #testBiometricBtn,
.web-demo #disableBiometricBtn { display: none !important; }
`);
await writeFile(index, html.replace('</head>',
  '<link rel="stylesheet" href="web-demo.css"><script src="web-demo.js"></script></head>')
  .replace('<title>Clinovyra · EMR</title>', '<title>Clinovyra · Vista web de muestra</title>'));
console.log(`Staged Clinovyra clinical preview: ${files.length} shared files`);
await copyFile(join(root, 'web', 'scripts', 'clinical-web.js'), join(live, 'clinical-web.js'));
await writeFile(join(live, 'clinical-web.css'), `
  .cloud-card .owner-access-banner, .cloud-card form, .cloud-card .session-card,
  .cloud-card .danger-zone, #enableBiometricBtn, #testBiometricBtn,
  #disableBiometricBtn { display:none !important; }
`);
const liveIndex = join(live, 'index.html');
const liveHtml = await readFile(liveIndex, 'utf8');
await writeFile(liveIndex, liveHtml.replace('</head>',
  '<link rel="stylesheet" href="clinical-web.css"><script src="clinical-web.js"></script></head>'));
