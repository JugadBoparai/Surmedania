#!/usr/bin/env node
/**
 * Generate PNG icons and social preview from a base SVG using sharp.
 * Usage: node scripts/generate-icons.js [--source ./src/assets/logo.svg]
 */
const fs = require('fs');
const path = require('path');

async function run(){
  const sharp = await import('sharp').then(m=>m.default || m);
  const projectRoot = process.cwd();
  const publicDir = path.join(projectRoot, 'public');
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

  // Default source logo. You can override with --source path
  const args = process.argv.slice(2);
  const sourceArgIdx = args.indexOf('--source');
  const sourcePath = sourceArgIdx !== -1 ? path.resolve(args[sourceArgIdx+1]) : path.join(projectRoot, 'src/assets/logo.svg');

  if (!fs.existsSync(sourcePath)){
    console.error(`Source not found: ${sourcePath}`);
    process.exit(1);
  }

  const targets = [
    { name: 'favicon-32.png', size: 32 },
    { name: 'favicon-192.png', size: 192 },
    { name: 'favicon-512.png', size: 512 }
  ];

  for (const t of targets){
    const out = path.join(publicDir, t.name);
    await sharp(sourcePath)
      .resize({ width: t.size, height: t.size, fit: 'contain', background: { r: 248, g: 245, b: 240, alpha: 1 } })
      .png({ compressionLevel: 9 })
      .toFile(out);
    console.log('Generated', t.name);
  }

  // Social preview 1200x630
  const socialOut = path.join(publicDir, 'social-preview.png');
  await sharp({ create: { width: 1200, height: 630, channels: 3, background: { r: 248, g: 245, b: 240 } } })
    .png()
    .composite([
      { input: sourcePath, gravity: 'center' }
    ])
    .toFile(socialOut);
  console.log('Generated social-preview.png');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
