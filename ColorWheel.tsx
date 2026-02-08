
import React, { useRef, useEffect, useState } from 'react';

interface ColorWheelProps {
  color: string;
  onChange: (color: string) => void;
}

const ColorWheel: React.FC<ColorWheelProps> = ({ color, onChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width;
    const radius = size / 2;
    const centerX = radius;
    const centerY = radius;

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

  const getColorAtPos = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const imageData = ctx.getImageData(x, y, 1, 1).data;
    const r = imageData[0];
    const g = imageData[1];
    const b = imageData[2];
    const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    onChange(hex);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      getColorAtPos(e.clientX - rect.left, e.clientY - rect.top);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      getColorAtPos(e.clientX - rect.left, e.clientY - rect.top);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative p-1 bg-white rounded-full shadow-lg border border-gray-100">
        <canvas
          ref={canvasRef}
          width={200}
          height={200}
          className="rounded-full cursor-crosshair touch-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
        />
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 border-white shadow-md pointer-events-none"
          style={{ backgroundColor: color }}
        />
      </div>
      <div className="flex items-center gap-2">
        <input 
          type="color" 
          value={color} 
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 border-none rounded cursor-pointer"
        />
        <span className="text-sm font-mono text-gray-500 uppercase">{color}</span>
      </div>
    </div>
  );
};

export default ColorWheel;
