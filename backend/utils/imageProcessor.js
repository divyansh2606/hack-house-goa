import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BRAND_COLORS = {
  primary: '#FF6B35',
  secondary: '#004E89',
  accent: '#F7C948',
  dark: '#1A1A2E',
  white: '#FFFFFF',
  gradient1: '#FF6B35',
  gradient2: '#FF8C42',
  teal: '#00B4D8',
  palm: '#2D6A4F'
};

// Generate PFP Frame overlay
export async function generateFrame(photoBuffer, outputPath) {
  const SIZE = 1000;
  const CENTER = SIZE / 2;
  const OUTER_RADIUS = 490;      // Outer gradient ring
  const INNER_RADIUS = 445;      // Where photo sits
  const PHOTO_DIAMETER = INNER_RADIUS * 2;

  // Process uploaded photo - handle any aspect ratio
  const photo = await sharp(photoBuffer)
    .rotate() // auto-rotate based on EXIF
    .resize(PHOTO_DIAMETER, PHOTO_DIAMETER, {
      fit: 'cover',
      position: 'centre'
    })
    .png()
    .toBuffer();

  // Create circular mask for photo
  const circleMask = Buffer.from(
    `<svg width="${PHOTO_DIAMETER}" height="${PHOTO_DIAMETER}">
      <circle cx="${PHOTO_DIAMETER / 2}" cy="${PHOTO_DIAMETER / 2}" r="${PHOTO_DIAMETER / 2}" fill="white"/>
    </svg>`
  );

  const circularPhoto = await sharp(photo)
    .composite([{
      input: circleMask,
      blend: 'dest-in'
    }])
    .png()
    .toBuffer();

  // Create the base frame (bottom layer - just the gradient ring)
  const baseFrameSvg = Buffer.from(`
    <svg width="${SIZE}" height="${SIZE}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="frameGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${BRAND_COLORS.primary};stop-opacity:1" />
          <stop offset="50%" style="stop-color:${BRAND_COLORS.accent};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${BRAND_COLORS.teal};stop-opacity:1" />
        </linearGradient>
      </defs>

      <!-- Transparent background -->
      <rect width="${SIZE}" height="${SIZE}" fill="none"/>

      <!-- Outer gradient circle -->
      <circle cx="${CENTER}" cy="${CENTER}" r="${OUTER_RADIUS}" fill="url(#frameGrad)"/>

      <!-- Inner cutout (transparent hole for photo) -->
      <circle cx="${CENTER}" cy="${CENTER}" r="${INNER_RADIUS}" fill="${BRAND_COLORS.dark}"/>
    </svg>
  `);

  // Create the top overlay layer (banners + decorations that go OVER the photo)
  const overlaySvg = Buffer.from(`
    <svg width="${SIZE}" height="${SIZE}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="5" flood-color="#000" flood-opacity="0.5"/>
        </filter>
        <linearGradient id="topBanner" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#E85826;stop-opacity:1" />
          <stop offset="50%" style="stop-color:${BRAND_COLORS.primary};stop-opacity:1" />
          <stop offset="100%" style="stop-color:#E85826;stop-opacity:1" />
        </linearGradient>
        <linearGradient id="bottomBanner" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#003668;stop-opacity:1" />
          <stop offset="50%" style="stop-color:${BRAND_COLORS.secondary};stop-opacity:1" />
          <stop offset="100%" style="stop-color:#003668;stop-opacity:1" />
        </linearGradient>
      </defs>

      <!-- TOP BANNER: HH GOA 2026 -->
      <g filter="url(#shadow)">
        <path d="M ${CENTER - 220} 40
                 Q ${CENTER} 15 ${CENTER + 220} 40
                 L ${CENTER + 210} 95
                 Q ${CENTER} 75 ${CENTER - 210} 95 Z"
              fill="url(#topBanner)" stroke="${BRAND_COLORS.accent}" stroke-width="2"/>
      </g>
      <text x="${CENTER}" y="72" text-anchor="middle"
        font-family="Arial Black, Impact, sans-serif" font-size="28" font-weight="900"
        fill="white" letter-spacing="6">HH GOA 2026</text>

      <!-- BOTTOM BANNER: BUILDER -->
      <g filter="url(#shadow)">
        <path d="M ${CENTER - 180} ${SIZE - 95}
                 Q ${CENTER} ${SIZE - 75} ${CENTER + 180} ${SIZE - 95}
                 L ${CENTER + 170} ${SIZE - 40}
                 Q ${CENTER} ${SIZE - 20} ${CENTER - 170} ${SIZE - 40} Z"
              fill="url(#bottomBanner)" stroke="${BRAND_COLORS.accent}" stroke-width="2"/>
      </g>
      <text x="${CENTER}" y="${SIZE - 55}" text-anchor="middle"
        font-family="Arial Black, Impact, sans-serif" font-size="20" font-weight="900"
        fill="${BRAND_COLORS.accent}" letter-spacing="8">⚡ BUILDER ⚡</text>

      <!-- Palm tree decorations on sides -->
      <text x="30" y="${CENTER + 15}" font-size="42" text-anchor="middle" filter="url(#shadow)">🌴</text>
      <text x="${SIZE - 30}" y="${CENTER + 15}" font-size="42" text-anchor="middle" filter="url(#shadow)">🌴</text>

      <!-- Corner accent dots -->
      <circle cx="${CENTER - 250}" cy="120" r="5" fill="${BRAND_COLORS.accent}"/>
      <circle cx="${CENTER + 250}" cy="120" r="5" fill="${BRAND_COLORS.accent}"/>
      <circle cx="${CENTER - 220}" cy="${SIZE - 120}" r="5" fill="${BRAND_COLORS.teal}"/>
      <circle cx="${CENTER + 220}" cy="${SIZE - 120}" r="5" fill="${BRAND_COLORS.teal}"/>

      <!-- Decorative dashed ring around outer edge -->
      <circle cx="${CENTER}" cy="${CENTER}" r="${OUTER_RADIUS - 3}" fill="none"
        stroke="white" stroke-width="1.5" stroke-dasharray="6 4" opacity="0.4"/>
    </svg>
  `);

  const baseFrame = await sharp(baseFrameSvg).png().toBuffer();
  const overlay = await sharp(overlaySvg).png().toBuffer();

  // Layer everything: base frame → photo → decorative overlay
  await sharp(baseFrame)
    .composite([
      {
        input: circularPhoto,
        left: Math.floor(CENTER - INNER_RADIUS),
        top: Math.floor(CENTER - INNER_RADIUS)
      },
      {
        input: overlay,
        left: 0,
        top: 0
      }
    ])
    .png({ quality: 95 })
    .toFile(outputPath);

  return outputPath;
}

// Builder titles for fun
const BUILDER_TITLES = [
  'Code Samurai', 'Bug Whisperer', 'Stack Surgeon', 'Pixel Alchemist',
  'Deploy Ninja', 'API Artisan', 'Logic Lord', 'Debug Detective',
  'Cache Commander', 'Query Queen', 'Merge Master', 'Sprint Sorcerer',
  'Refactor Rebel', 'Schema Sage', 'Runtime Ronin', 'Lambda Legend',
  'Docker Druid', 'Regex Ranger', 'Bit Bender', 'Hash Hero',
  'Pointer Paladin', 'Thread Thief', 'Byte Baron', 'Null Knight',
  'Syntax Shaman', 'Loop Luminary', 'Packet Pirate', 'Kernel King'
];

function getRandomTitle() {
  return BUILDER_TITLES[Math.floor(Math.random() * BUILDER_TITLES.length)];
}

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Generate ID Card
export async function generateIDCard(photoBuffer, outputPath, fields) {
  const WIDTH = 900;
  const HEIGHT = 550;
  const PHOTO_SIZE = 200;
  const builderTitle = getRandomTitle();

  const safeName = escapeXml(fields.name);
  const safeRole = escapeXml(fields.role);
  const safeStack = escapeXml(fields.stack);
  const safeTitle = escapeXml(builderTitle);

  // Process photo
  const photo = await sharp(photoBuffer)
    .rotate()
    .resize(PHOTO_SIZE, PHOTO_SIZE, {
      fit: 'cover',
      position: 'centre'
    })
    .png()
    .toBuffer();

  // Round the photo
  const roundMask = Buffer.from(
    `<svg width="${PHOTO_SIZE}" height="${PHOTO_SIZE}">
      <rect width="${PHOTO_SIZE}" height="${PHOTO_SIZE}" rx="20" ry="20" fill="white"/>
    </svg>`
  );

  const roundedPhoto = await sharp(photo)
    .composite([{ input: roundMask, blend: 'dest-in' }])
    .png()
    .toBuffer();

  // Generate a unique badge number
  const badgeNum = `HH-${Math.random().toString(36).substring(2, 6).toUpperCase()}-26`;

  // Create card SVG
  const cardSvg = Buffer.from(`
    <svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1A1A2E;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#16213E;stop-opacity:1" />
        </linearGradient>
        <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:${BRAND_COLORS.primary};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${BRAND_COLORS.accent};stop-opacity:1" />
        </linearGradient>
        <linearGradient id="accentLine" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:${BRAND_COLORS.primary};stop-opacity:1" />
          <stop offset="50%" style="stop-color:${BRAND_COLORS.accent};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${BRAND_COLORS.teal};stop-opacity:1" />
        </linearGradient>
        <filter id="cardShadow">
          <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#000" flood-opacity="0.4"/>
        </filter>
        <clipPath id="cardClip">
          <rect width="${WIDTH}" height="${HEIGHT}" rx="24" ry="24"/>
        </clipPath>
      </defs>

      <!-- Card body -->
      <g clip-path="url(#cardClip)">
        <!-- Background -->
        <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bgGrad)"/>

        <!-- Subtle pattern lines -->
        <line x1="0" y1="50" x2="${WIDTH}" y2="50" stroke="white" stroke-opacity="0.03" stroke-width="1"/>
        <line x1="0" y1="150" x2="${WIDTH}" y2="150" stroke="white" stroke-opacity="0.03" stroke-width="1"/>
        <line x1="0" y1="250" x2="${WIDTH}" y2="250" stroke="white" stroke-opacity="0.03" stroke-width="1"/>
        <line x1="0" y1="350" x2="${WIDTH}" y2="350" stroke="white" stroke-opacity="0.03" stroke-width="1"/>
        <line x1="0" y1="450" x2="${WIDTH}" y2="450" stroke="white" stroke-opacity="0.03" stroke-width="1"/>

        <!-- Header bar -->
        <rect x="0" y="0" width="${WIDTH}" height="80" fill="url(#headerGrad)"/>

        <!-- Event title in header -->
        <text x="30" y="35" font-family="Arial Black, sans-serif" font-size="22"
          font-weight="900" fill="white" letter-spacing="4">HH GOA 2026</text>
        <text x="30" y="60" font-family="Arial, sans-serif" font-size="13"
          fill="rgba(255,255,255,0.85)" letter-spacing="1">HEADOUT HACKATHON • GOA EDITION</text>

        <!-- Badge type -->
        <rect x="${WIDTH - 170}" y="18" width="140" height="44" rx="22" fill="rgba(0,0,0,0.3)"/>
        <text x="${WIDTH - 100}" y="46" text-anchor="middle"
          font-family="Arial Black, sans-serif" font-size="14" font-weight="bold"
          fill="${BRAND_COLORS.accent}" letter-spacing="3">BUILDER</text>

        <!-- Accent line below header -->
        <rect x="0" y="80" width="${WIDTH}" height="4" fill="url(#accentLine)"/>

        <!-- Photo area background -->
        <rect x="30" y="105" width="${PHOTO_SIZE + 20}" height="${PHOTO_SIZE + 20}" rx="24"
          fill="rgba(255,255,255,0.05)" stroke="${BRAND_COLORS.primary}" stroke-width="2"/>

        <!-- Info section -->
        <!-- Name -->
        <text x="290" y="145" font-family="Arial Black, sans-serif" font-size="32"
          font-weight="900" fill="white">${safeName}</text>

        <!-- Builder Title -->
        <text x="290" y="180" font-family="Arial, sans-serif" font-size="16"
          fill="${BRAND_COLORS.primary}" font-weight="bold">✦ ${safeTitle}</text>

        <!-- Divider -->
        <line x1="290" y1="200" x2="${WIDTH - 40}" y2="200"
          stroke="rgba(255,255,255,0.1)" stroke-width="1"/>

        <!-- Role -->
        <text x="290" y="235" font-family="Arial, sans-serif" font-size="12"
          fill="${BRAND_COLORS.accent}" letter-spacing="2" font-weight="bold">ROLE</text>
        <text x="290" y="260" font-family="Arial, sans-serif" font-size="20"
          fill="white">${safeRole}</text>

        <!-- Stack -->
        <text x="290" y="300" font-family="Arial, sans-serif" font-size="12"
          fill="${BRAND_COLORS.accent}" letter-spacing="2" font-weight="bold">STACK</text>
        <text x="290" y="325" font-family="Arial, sans-serif" font-size="20"
          fill="white">${safeStack}</text>

        <!-- Badge Number -->
        <text x="290" y="365" font-family="Arial, sans-serif" font-size="12"
          fill="${BRAND_COLORS.accent}" letter-spacing="2" font-weight="bold">BADGE ID</text>
        <text x="290" y="390" font-family="Courier New, monospace" font-size="20"
          fill="${BRAND_COLORS.teal}">${badgeNum}</text>

        <!-- Bottom bar -->
        <rect x="0" y="${HEIGHT - 70}" width="${WIDTH}" height="70" fill="rgba(0,0,0,0.3)"/>
        <rect x="0" y="${HEIGHT - 70}" width="${WIDTH}" height="3" fill="url(#accentLine)"/>

        <!-- Bottom info -->
        <text x="30" y="${HEIGHT - 35}" font-family="Arial, sans-serif" font-size="14"
          fill="rgba(255,255,255,0.6)">🌴 Goa, India • 2026</text>
        <text x="${WIDTH - 30}" y="${HEIGHT - 42}" text-anchor="end"
          font-family="Arial, sans-serif" font-size="11"
          fill="rgba(255,255,255,0.4)" letter-spacing="1">#FrameInGoa</text>
        <text x="${WIDTH - 30}" y="${HEIGHT - 22}" text-anchor="end"
          font-family="Arial, sans-serif" font-size="11"
          fill="rgba(255,255,255,0.4)">headouthackathon.com</text>

        <!-- Decorative elements -->
        <circle cx="${WIDTH - 60}" cy="145" r="35" fill="none" stroke="${BRAND_COLORS.teal}"
          stroke-width="1" opacity="0.15"/>
        <circle cx="${WIDTH - 60}" cy="145" r="25" fill="none" stroke="${BRAND_COLORS.primary}"
          stroke-width="1" opacity="0.15"/>
      </g>

      <!-- Card border -->
      <rect width="${WIDTH}" height="${HEIGHT}" rx="24" ry="24" fill="none"
        stroke="rgba(255,255,255,0.1)" stroke-width="2"/>
    </svg>
  `);

  const card = await sharp(cardSvg).png().toBuffer();

  // Composite photo onto card
  await sharp(card)
    .composite([{
      input: roundedPhoto,
      left: 40,
      top: 115
    }])
    .png({ quality: 95 })
    .toFile(outputPath);

  return outputPath;
}