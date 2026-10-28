import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const portraitPath = fileURLToPath(new URL("../public/images/profile/portrait.webp", import.meta.url));
const outputDirectory = fileURLToPath(new URL("../public/images/social", import.meta.url));
const outputPath = fileURLToPath(new URL("../public/images/social/portfolio-social.jpg", import.meta.url));

const portraitMask = Buffer.from(`
  <svg width="360" height="470" xmlns="http://www.w3.org/2000/svg">
    <rect width="360" height="470" rx="36" fill="white"/>
  </svg>
`);

const portrait = await sharp(portraitPath)
  .resize(360, 470, { fit: "cover", position: "top" })
  .composite([{ input: portraitMask, blend: "dest-in" }])
  .png()
  .toBuffer();

const background = Buffer.from(`
  <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
    <rect width="1200" height="630" fill="#f3ede2"/>
    <circle cx="1110" cy="70" r="210" fill="#d58b78" opacity="0.2"/>
    <path d="M70 74H1130" stroke="#10263b" stroke-opacity="0.22"/>
    <circle cx="104" cy="112" r="34" fill="#10263b"/>
    <text x="104" y="121" fill="#fffaf2" font-family="Georgia, serif" font-size="18" font-weight="700" text-anchor="middle">F/M</text>
    <text x="70" y="214" fill="#983f33" font-family="monospace" font-size="18" font-weight="700" letter-spacing="3">PORTFOLIO</text>
    <text x="70" y="300" fill="#10263b" font-family="Georgia, serif" font-size="58" font-weight="500">Fenotiana Michael</text>
    <text x="70" y="361" fill="#10263b" font-family="Georgia, serif" font-size="42">Développeur full-stack</text>
    <text x="70" y="411" fill="#10263b" font-family="Georgia, serif" font-size="42">web et mobile</text>
    <text x="70" y="502" fill="#56616a" font-family="Arial, sans-serif" font-size="24">Applications · Interfaces métier · API</text>
    <path d="M70 550H690" stroke="#983f33" stroke-width="4"/>
    <rect x="764" y="72" width="390" height="520" rx="48" fill="#fffaf2" stroke="#10263b" stroke-opacity="0.5"/>
    <rect x="790" y="98" width="360" height="470" rx="36" fill="#e8dfd1"/>
  </svg>
`);

await mkdir(outputDirectory, { recursive: true });
await sharp(background)
  .composite([{ input: portrait, left: 790, top: 98 }])
  .jpeg({ quality: 88, chromaSubsampling: "4:4:4" })
  .toFile(outputPath);

console.log(`Image sociale générée : ${outputPath}`);
