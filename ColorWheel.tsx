
import React, { useRef, useEffect, useState, useCallback } from 'react';

interface ColorWheelProps {
  color: string;
  onChange: (color: string) => void;
}

const ColorWheel: React.FC<ColorWheelProps> = ({ color, onChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [indicatorPos, setIndicatorPos] = useState({ x: 110, y: 110 });
  const [hueColor, setHueColor] = useState('#ff0000'); // 记录当前的色相
  const [lightness, setLightness] = useState(100); // 0-100

  // 辅助函数：将 RGB 转换为 HEX
  const rgbToHex = (r: number, g: number, b: number) => {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  };

  // 辅助函数：将 HEX 转换为 RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 255, g: 255, b: 255 };
  };

  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width;
    const radius = size / 2;
    const centerX = radius;
    const centerY = radius;

    ctx.clearRect(0, 0, size, size);

    for (let angle = 0; angle < 360; angle++) {
      const startAngle = (angle * Math.PI) / 180;
      const endAngle = ((angle + 2) * Math.PI) / 180;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
      gradient.addColorStop(0, '#ffffff');
      gradient.addColorStop(1, `hsl(${angle}, 100%, 50%)`);
      ctx.fillStyle = gradient;
      ctx.fill();
    }
  };

  useEffect(() => {
    drawWheel();
  }, []);

  // 当亮度改变时，应用亮度到当前色相
  const applyLightness = useCallback((baseColor: string, l: number) => {
    const rgb = hexToRgb(baseColor);
    const factor = l / 100;
    const r = Math.round(rgb.r * factor);
    const g = Math.round(rgb.g * factor);
    const b = Math.round(rgb.b * factor);
    return rgbToHex(r, g, b);
  }, []);

  const updateColorAndPos = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const radius = canvas.width / 2;

    let finalX = x;
    let finalY = y;

    if (distance > radius) {
      finalX = centerX + (dx / distance) * radius;
      finalY = centerY + (dy / distance) * radius;
    }

    setIndicatorPos({ x: finalX, y: finalY });

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    
    const imageData = ctx.getImageData(finalX, finalY, 1, 1).data;
    const sampledHex = rgbToHex(imageData[0], imageData[1], imageData[2]);
    setHueColor(sampledHex);
    onChange(applyLightness(sampledHex, lightness));
  }, [onChange, lightness, applyLightness]);

  const handleLightnessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newL = parseInt(e.target.value);
    setLightness(newL);
    onChange(applyLightness(hueColor, newL));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updateColorAndPos(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    updateColorAndPos(e.clientX, e.clientY);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div 
        ref={containerRef}
        className="relative p-2 bg-white rounded-full shadow-[inset_0_2px_10px_rgba(0,0,0,0.05)] border border-gray-100 group"
      >
        <canvas
          ref={canvasRef}
          width={220}
          height={220}
          className="rounded-full cursor-crosshair touch-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          onTouchStart={(e) => {
            setIsDragging(true);
            updateColorAndPos(e.touches[0].clientX, e.touches[0].clientY);
          }}
          onTouchMove={(e) => updateColorAndPos(e.touches[0].clientX, e.touches[0].clientY)}
          onTouchEnd={() => setIsDragging(false)}
        />
        
        {/* 灵动追踪光点 */}
        <div 
          className={`absolute pointer-events-none transition-transform duration-75 ease-out ${isDragging ? 'scale-125' : 'scale-100'}`}
          style={{ 
            left: indicatorPos.x + 8,
            top: indicatorPos.y + 8,
            transform: `translate(-50%, -50%)`
          }}
        >
          <div className="absolute inset-0 w-8 h-8 -m-4 rounded-full border-2 border-white shadow-[0_0_15px_rgba(255,255,255,0.8),0_0_5px_rgba(0,0,0,0.2)]" />
          <div className="w-2 h-2 bg-white rounded-full shadow-sm" />
        </div>

        {/* 中心颜色预览 */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full border-4 border-white shadow-xl transition-colors duration-200 pointer-events-none"
          style={{ backgroundColor: color }}
        />
      </div>

      {/* 亮度/黑色选择滑块 */}
      <div className="w-full px-4 space-y-2">
        <div className="flex justify-between items-center text-[9px] text-gray-400 font-black uppercase tracking-widest px-1">
          <span>亮度 (提供黑色)</span>
          <span className="text-indigo-600">{lightness}%</span>
        </div>
        <div className="relative h-6 flex items-center">
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={lightness}
            onChange={handleLightnessChange}
            className="w-full accent-indigo-600 h-2 bg-gray-100 rounded-full appearance-none cursor-pointer z-10"
            style={{
              background: `linear-gradient(to right, #000000, ${hueColor})`
            }}
          />
        </div>
      </div>

      <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-2xl border border-gray-100">
        <div 
          className="w-4 h-4 rounded-full shadow-inner transition-colors duration-300" 
          style={{ backgroundColor: color }}
        />
        <span className="text-[11px] font-black font-mono text-gray-400 uppercase tracking-widest">{color}</span>
      </div>
    </div>
  );
};

export default ColorWheel;
