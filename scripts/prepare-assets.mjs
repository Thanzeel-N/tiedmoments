import sharp from 'sharp';
import { mkdir, readdir, writeFile } from 'node:fs/promises';
import fs from 'node:fs';

const assets = [
  'forever', 'bride', 'friends', 'monochrome', 'celebration',
  'haldi', 'groom', 'veil', 'party', 'tradition',
  'details', 'together', 'gentleman', 'vintage', 'bloom',
  'architecture', 'sunshine'
];

await mkdir('public/images', { recursive: true });
const blurMap = {};

if (fs.existsSync('gallery')) {
  const files = (await readdir('gallery')).sort();
  const assetIndices = {
    forever: 12, bride: 0, friends: 5, monochrome: 13, celebration: 10,
    haldi: 17, groom: 4, veil: 2, party: 9, tradition: 1,
    details: 3, together: 6, gentleman: 7, vintage: 8, bloom: 11,
    architecture: 14, sunshine: 16
  };
  for (const [name, index] of Object.entries(assetIndices)) {
    const filePath = `gallery/${files[index]}`;
    await sharp(filePath)
      .rotate()
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 80, effort: 6 })
      .toFile(`public/images/${name}.webp`);

    const blurBuffer = await sharp(filePath)
      .rotate()
      .resize(16, 16, { fit: 'inside' })
      .webp({ quality: 20 })
      .toBuffer();

    blurMap[name] = `data:image/webp;base64,${blurBuffer.toString('base64')}`;
  }
} else {
  // Re-verify and generate blur map from public/images
  for (const name of assets) {
    const filePath = `public/images/${name}.webp`;
    const blurBuffer = await sharp(filePath)
      .rotate()
      .resize(16, 16, { fit: 'inside' })
      .webp({ quality: 20 })
      .toBuffer();
    blurMap[name] = `data:image/webp;base64,${blurBuffer.toString('base64')}`;
  }
}

await writeFile('app/blur-data.json', JSON.stringify(blurMap, null, 2));

if (fs.existsSync('public/logo.webp')) {
  console.log('Logo metadata (webp):', await sharp('public/logo.webp').metadata());
}

console.log('Prepared 17 unique optimised photographs in WebP with blur placeholders.');
