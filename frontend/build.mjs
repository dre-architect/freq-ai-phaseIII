import { copyFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve('..');
const out = resolve('dist');
const files = ['index.html','simulation.html','architecture.html','contact.html','styles.css','app.js','favicon.svg','vercel.json'];

mkdirSync(out, { recursive: true });
for (const file of files) {
  copyFileSync(resolve(root, file), resolve(out, file));
}
console.log('FREQ AI static web build complete.');
