
import React, { useRef, useEffect } from 'react';
import { AvatarSettings, TextPosition, FontStyle } from '../types';

interface AvatarPreviewProps {
  settings: AvatarSettings;
  onCanvasRef: (canvas: HTMLCanvasElement | null) => void;
}

const AvatarPreview: React.FC<AvatarPreviewProps> = ({ settings, onCanvasRef }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width;
    const center = size / 2;

    // Background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, size, size);

    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 0, g: 0, b: 0 };
    };

    const rgb = hexToRgb(settings.color);
    const layers = 15;
    // 使用 auraSize 计算基础半径 (30-100 映射到 size 的比例)
    const baseRadius = size * (settings.auraSize / 200);
    
    // Draw more organic aura layers
    for (let i = 0; i < layers; i++) {
      const radius = baseRadius * (1 - (i * 0.035));
      const opacity = (settings.intensity / 100) * (0.03 + (i * 0.015));
      const grad = ctx.createRadialGradient(center, center, 0, center, center, radius * 1.8);
      grad.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`);
      grad.addColorStop(0.7, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity * 0.2})`);
      grad.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(center, center, radius * 1.8, 0, Math.PI * 2);
      ctx.fill();
    }

    let displayText = settings.text;
    if (settings.textTransform === 'uppercase') displayText = displayText.toUpperCase();
    if (settings.textTransform === 'lowercase') displayText = displayText.toLowerCase();
    if (settings.textTransform === 'capitalize') {
      displayText = displayText.split(' ').map(s => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()).join(' ');
    }

    ctx.fillStyle = 'rgba(255, 255, 255, 0.99)';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
    ctx.shadowBlur = 8;
    
    let fontStr = `${settings.fontSize}px `;
    switch(settings.fontStyle) {
      case FontStyle.WILD_SHADE: fontStr += '"Bungee Shade", cursive'; break;
      case FontStyle.WILD_METAL: fontStr += '"Metal Mania", cursive'; break;
      case FontStyle.WILD_BEAST: fontStr += '"Rubik Beastly", cursive'; break;
      case FontStyle.WILD_IMPACT: fontStr += '"Syne", sans-serif'; break;
      case FontStyle.WILD_MARKER: fontStr += '"Permanent Marker", cursive'; break;
      case FontStyle.WILD_ROCK: fontStr += '"Rock Salt", cursive'; break;
      case FontStyle.WILD_CREEP: fontStr += '"Creepster", cursive'; break;
      case FontStyle.LUXE_MONSIEUR: fontStr += '"Monsieur La Doulaise", cursive'; break;
      case FontStyle.LUXE_PINYON: fontStr += '"Pinyon Script", cursive'; break;
      case FontStyle.LUXE_ITALIANNO: fontStr += '"Italianno", cursive'; break;
      case FontStyle.LUXE_DECO: fontStr += '"Cinzel Decorative", serif'; break;
      case FontStyle.LUXE_VIBES: fontStr += '"Great Vibes", cursive'; break;
      case FontStyle.LUXE_PARISIENNE: fontStr += '"Parisienne", cursive'; break;
      case FontStyle.RAW_REENIE: fontStr += '"Reenie Beanie", cursive'; break;
      case FontStyle.RAW_JUST_HAND: fontStr += '"Just Another Hand", cursive'; break;
      case FontStyle.RAW_GRACE: fontStr += '"Covered By Your Grace", cursive'; break;
      case FontStyle.RAW_ZEYADA: fontStr += '"Zeyada", cursive'; break;
      case FontStyle.RAW_NANUM: fontStr += '"Nanum Pen Script", cursive'; break;
      case FontStyle.GOTHIC: fontStr += '"UnifrakturMaguntia", cursive'; break;
      default: fontStr += '"Inter", sans-serif'; break;
    }
    
    ctx.font = fontStr;
    // @ts-ignore
    ctx.letterSpacing = `${settings.letterSpacing}px`;

    let x = center;
    let y = center;
    const padding = size * 0.12;

    switch (settings.position) {
      case TextPosition.CENTER:
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        x = center;
        y = center;
        break;
      case TextPosition.BOTTOM_RIGHT:
        ctx.textAlign = 'right';
        ctx.textBaseline = 'bottom';
        x = size - padding;
        y = size - padding;
        break;
      case TextPosition.BOTTOM_LEFT:
        ctx.textAlign = 'left';
        ctx.textBaseline = 'bottom';
        x = padding;
        y = size - padding;
        break;
      case TextPosition.TOP_RIGHT:
        ctx.textAlign = 'right';
        ctx.textBaseline = 'top';
        x = size - padding;
        y = padding;
        break;
    }

    ctx.fillText(displayText, x, y);
    // @ts-ignore
    ctx.letterSpacing = '0px';
    ctx.shadowBlur = 0;
  };

  useEffect(() => {
    draw();
    onCanvasRef(canvasRef.current);
  }, [settings]);

  return (
    <div className="relative bg-white p-6 rounded-[3rem] shadow-[0_25px_60px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden">
      <canvas
        ref={canvasRef}
        width={1024}
        height={1024}
        className="w-full h-auto max-w-[440px] aspect-square rounded-[2rem] cursor-default"
      />
      <div className="mt-6 text-center text-[9px] text-gray-300 font-extrabold tracking-[0.4em] uppercase">
        艺术工作室高清渲染 • 1024px
      </div>
    </div>
  );
};

export default AvatarPreview;
