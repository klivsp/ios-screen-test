// One-off generator for the Speaker Test's stereo tone assets.
// Run with: node scripts/generate-tones.js
const fs = require("fs");
const path = require("path");

const SAMPLE_RATE = 44100;
const DURATION_S = 1.5;
const FREQ = 440;
const AMPLITUDE = 0.5; // keep well under clipping
const FADE_S = 0.05;

const numSamples = Math.floor(SAMPLE_RATE * DURATION_S);

function toneSample(i) {
  const t = i / SAMPLE_RATE;
  const fadeSamples = FADE_S * SAMPLE_RATE;
  let env = 1;
  if (i < fadeSamples) env = i / fadeSamples;
  else if (i > numSamples - fadeSamples) env = (numSamples - i) / fadeSamples;
  return Math.sin(2 * Math.PI * FREQ * t) * AMPLITUDE * env;
}

function writeWav(filename, channelGain) {
  const dataSize = numSamples * 2 /* channels */ * 2 /* bytes per sample */;
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(2, 22); // stereo
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(SAMPLE_RATE * 2 * 2, 28); // byte rate
  buffer.writeUInt16LE(4, 32); // block align
  buffer.writeUInt16LE(16, 34); // bits per sample
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);

  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    const s = toneSample(i);
    const left = Math.round(s * channelGain[0] * 32767);
    const right = Math.round(s * channelGain[1] * 32767);
    buffer.writeInt16LE(left, offset);
    buffer.writeInt16LE(right, offset + 2);
    offset += 4;
  }

  fs.writeFileSync(filename, buffer);
  console.log("wrote", filename);
}

const outDir = path.join(__dirname, "..", "assets", "audio");
fs.mkdirSync(outDir, { recursive: true });
writeWav(path.join(outDir, "left.wav"), [1, 0]);
writeWav(path.join(outDir, "right.wav"), [0, 1]);
writeWav(path.join(outDir, "both.wav"), [1, 1]);
