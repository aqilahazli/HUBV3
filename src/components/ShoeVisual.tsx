import React, { useState } from 'react';
import { ShoeColorName } from '../types';
import { STUDIO_IMAGES, ALL_COLORS } from '../data/volterraData';

interface ShoeVisualProps {
  src: string;
  alt: string;
  color?: ShoeColorName;
  angle?: 'main' | 'side' | 'top' | 'detail';
  className?: string;
  aspectClass?: string;
  showAngleTag?: boolean;
  sku?: string;
}

const COLOR_IMAGE_MAP: Record<ShoeColorName, string> = {
  White: STUDIO_IMAGES.running,
  Orange: STUDIO_IMAGES.hero,
  Black: STUDIO_IMAGES.basketball,
  Blue: STUDIO_IMAGES.training,
  Green: STUDIO_IMAGES.trail,
  Red: STUDIO_IMAGES.basketball,
  Grey: STUDIO_IMAGES.running,
};

const COLOR_OVERLAY_FILTER: Record<ShoeColorName, string> = {
  White: 'contrast(1.03) brightness(1.03)',
  Black: 'contrast(1.08) brightness(0.95)',
  Orange: 'contrast(1.05) saturate(1.15)',
  Red: 'contrast(1.08) hue-rotate(-12deg) saturate(1.2)',
  Blue: 'contrast(1.05) saturate(1.12)',
  Green: 'contrast(1.06) saturate(1.1)',
  Grey: 'grayscale(0.55) contrast(1.06)',
};

const ANGLE_TRANSFORM: Record<'main' | 'side' | 'top' | 'detail', string> = {
  main: 'scale-100',
  side: 'scale-105 -rotate-2',
  top: 'scale-110 rotate-3',
  detail: 'scale-125 origin-bottom-right',
};

const ANGLE_LABELS: Record<'main' | 'side' | 'top' | 'detail', string> = {
  main: '01 / Studio Profile',
  side: '02 / Lateral Chassis',
  top: '03 / Upper Weave',
  detail: '04 / Outsole & Foam',
};

function normalizeImageSrc(rawSrc: string): string {
  if (!rawSrc) return STUDIO_IMAGES.running;
  if (rawSrc.includes('hero_volterra_shoe')) return STUDIO_IMAGES.hero;
  if (rawSrc.includes('shoe_running_aerorun')) return STUDIO_IMAGES.running;
  if (rawSrc.includes('shoe_trail_force')) return STUDIO_IMAGES.trail;
  if (rawSrc.includes('shoe_basketball_courtrise')) return STUDIO_IMAGES.basketball;
  if (rawSrc.includes('shoe_training_powertrain')) return STUDIO_IMAGES.training;
  return rawSrc;
}

export const ShoeVisual: React.FC<ShoeVisualProps> = ({
  src,
  alt,
  color,
  angle = 'main',
  className = '',
  aspectClass = 'aspect-[4/3]',
  showAngleTag = false,
  sku,
}) => {
  const [imgError, setImgError] = useState(false);

  // Determine effective image based on selected color and angle
  const resolvedSrc =
    color && angle === 'main' && COLOR_IMAGE_MAP[color]
      ? COLOR_IMAGE_MAP[color]
      : normalizeImageSrc(src);

  const colorInfo = color ? ALL_COLORS.find((c) => c.name === color) : undefined;
  const filterStyle = color ? COLOR_OVERLAY_FILTER[color] : undefined;

  return (
    <div
      className={`relative overflow-hidden bg-[#F2F2F0] select-none ${aspectClass} ${className}`}
    >
      {!imgError ? (
        <img
          src={resolvedSrc}
          alt={alt}
          referrerPolicy="no-referrer"
          loading="lazy"
          onError={() => setImgError(true)}
          style={filterStyle ? { filter: filterStyle } : undefined}
          className={`w-full h-full object-cover transition-transform duration-300 ease-out ${ANGLE_TRANSFORM[angle]}`}
        />
      ) : (
        /* Resilient Studio Fallback Container (Zero-Broken-Image Policy) */
        <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#18181B] via-[#27272A] to-[#111113] text-white">
          <svg
            viewBox="0 0 120 60"
            className="w-28 h-14 stroke-current text-[#E1381C] mb-3"
            fill="none"
            strokeWidth="2.5"
          >
            <path d="M10 44 C20 44, 32 22, 48 18 L66 28 C82 32, 98 30, 110 38 C112 42, 108 48, 98 48 L14 48 C8 48, 8 44, 10 44 Z" />
            <path d="M16 48 L104 48" stroke="#F9F9F8" strokeWidth="3" />
          </svg>
          <span className="font-display text-xs tracking-widest text-zinc-300">
            VOLTERRA STUDIO
          </span>
          <span className="text-[11px] text-zinc-400 mt-1 text-center line-clamp-1">
            {alt}
          </span>
        </div>
      )}

      {/* Subtle Color Calibration Indicator when color variant is active */}
      {colorInfo && showAngleTag && (
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="bg-[#111113]/80 backdrop-blur-sm text-white px-2.5 py-1 rounded text-[11px] flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full border border-white/40 shrink-0"
              style={{ backgroundColor: colorInfo.hex }}
            />
            <span className="truncate">{colorInfo.label}</span>
          </div>
          <span className="bg-[#111113]/80 backdrop-blur-sm text-zinc-200 px-2.5 py-1 rounded font-mono-num text-[11px]">
            {ANGLE_LABELS[angle]}
          </span>
        </div>
      )}

      {sku && !showAngleTag && (
        <div className="absolute bottom-2.5 left-3 pointer-events-none">
          <span className="font-mono-num text-[10px] text-zinc-500/80 bg-white/75 backdrop-blur-xs px-1.5 py-0.5 rounded">
            {sku}
          </span>
        </div>
      )}
    </div>
  );
};
