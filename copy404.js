
import fs from 'fs';
import path from 'path';

const indexPath = path.resolve('dist/index.html');
const errorPath = path.resolve('dist/404.html');

try {
    fs.copyFileSync(indexPath, errorPath);
    console.log('✅ 404.html copied from index.html');
} catch (error) {
    console.error('❌ Failed to copy 404.html:', error.message);
}
