import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve(process.cwd(), 'dist');
const androidAssetsDir = path.resolve(process.cwd(), 'android/app/src/main/assets');

if (!fs.existsSync(distDir)) {
  console.log('[postbuild] dist/ directory not found. Skipping asset copy.');
  process.exit(0);
}

try {
  fs.mkdirSync(androidAssetsDir, { recursive: true });
  fs.cpSync(distDir, androidAssetsDir, { recursive: true });
  
  // Also create a dist subfolder in assets so both path styles work
  const nestedDist = path.join(androidAssetsDir, 'dist');
  fs.mkdirSync(nestedDist, { recursive: true });
  fs.cpSync(distDir, nestedDist, { recursive: true });

  console.log(`[postbuild] ✅ Successfully synced production assets from dist/ to ${androidAssetsDir}`);
} catch (error) {
  console.error('[postbuild] ⚠️ Error copying assets to Android directory:', error);
}
