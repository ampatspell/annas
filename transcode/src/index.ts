import { spawn } from 'node:child_process';
import { glob, mkdir } from 'node:fs/promises';
import { dirname, join, parse } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const INPUT = join(__dirname, '../../videos');
const OUTPUT = join(__dirname, '../../videos/transcoded');

const loadInputs = async () => {
  const inputs = [];
  for await(let entry of glob(join(INPUT, '*.mp4'))) {
    inputs.push(parse(entry).base);
  }
  return inputs;
}

const transcode = async (name: string) => {
  const input = join(INPUT, name);
  const output = join(OUTPUT, name);
  await mkdir(OUTPUT, { recursive: true });

  return new Promise<void>((resolve) => {
    const process = spawn('ffmpeg', [
      `-i`,
      input,
      `-vf`,
      `scale=1280:720::-1`,
      `-c:a`,
      `copy`,
      output,
    ], { stdio: 'inherit' });
    process.addListener('exit', () => {
      resolve();
    });
  });
}

let inputs = await loadInputs();

for(let input of inputs) {
  await transcode(input);
}
