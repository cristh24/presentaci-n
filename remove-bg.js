const { Jimp } = require('jimp');
const path = require('path');

const images = [
  'img/image7.jpg',
  'img/image31.jpg',
  'img/image34.jpg',
  'img/image35.jpg',
  'img/image50.jpg',
  'img/image59.jpg',
];

// Tolerance: pixel with R,G,B all below this value is considered "black"
const THRESHOLD = 40;

function isBlack(r, g, b) {
  return r < THRESHOLD && g < THRESHOLD && b < THRESHOLD;
}

async function removeBlackBackground(inputPath) {
  const image = await Jimp.read(inputPath);
  const { width, height, data } = image.bitmap;

  const visited = new Uint8Array(width * height);
  const queue = [];

  // Seed from all border pixels
  for (let x = 0; x < width; x++) {
    for (const y of [0, height - 1]) {
      const idx = y * width + x;
      const p = idx * 4;
      if (!visited[idx] && isBlack(data[p], data[p + 1], data[p + 2])) {
        visited[idx] = 1;
        queue.push(idx);
      }
    }
  }
  for (let y = 1; y < height - 1; y++) {
    for (const x of [0, width - 1]) {
      const idx = y * width + x;
      const p = idx * 4;
      if (!visited[idx] && isBlack(data[p], data[p + 1], data[p + 2])) {
        visited[idx] = 1;
        queue.push(idx);
      }
    }
  }

  // BFS flood fill
  let head = 0;
  while (head < queue.length) {
    const idx = queue[head++];
    const p = idx * 4;
    // Make transparent
    data[p] = 0;
    data[p + 1] = 0;
    data[p + 2] = 0;
    data[p + 3] = 0;

    const x = idx % width;
    const y = Math.floor(idx / width);

    const neighbors = [
      x > 0 ? idx - 1 : -1,
      x < width - 1 ? idx + 1 : -1,
      y > 0 ? idx - width : -1,
      y < height - 1 ? idx + width : -1,
    ];

    for (const nIdx of neighbors) {
      if (nIdx < 0 || visited[nIdx]) continue;
      const np = nIdx * 4;
      if (isBlack(data[np], data[np + 1], data[np + 2])) {
        visited[nIdx] = 1;
        queue.push(nIdx);
      }
    }
  }

  const outputPath = inputPath.replace(/\.(jpg|jpeg)$/i, '-clean.png');
  await image.write(outputPath);
  console.log(`✓ ${outputPath}`);
}

(async () => {
  for (const imgPath of images) {
    process.stdout.write(`Procesando ${imgPath}... `);
    try {
      await removeBlackBackground(imgPath);
    } catch (e) {
      console.error(`ERROR: ${e.message}`);
    }
  }
  console.log('\nListo!');
})();
