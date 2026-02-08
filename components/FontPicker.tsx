
import React, { useState } from 'react';
import { FontStyle } from '../types';
import { ChevronDown, Check } from 'lucide-react';

interface FontPickerProps {
  value: FontStyle;
  onChange: (value: FontStyle) => void;
}

const fontGroups = [
  {
    name: '先锋豪放 (Impact & Bold)',
    fonts: [
      { id: FontStyle.WILD_METAL, name: 'Metal Mania', desc: '锐利重金属' },
      { id: FontStyle.WILD_MARKER, name: 'Permanent Marker', desc: '粗犷记号笔' },
      { id: FontStyle.WILD_ROCK, name: 'Rock Salt', desc: '岩石/涂鸦' },
      { id: FontStyle.WILD_SHADE, name: 'Bungee Shade', desc: '工业立体' },
      { id: FontStyle.WILD_BEAST, name: 'Rubik Beastly', desc: '野性变形' },
      { id: FontStyle.WILD_IMPACT, name: 'Syne Ultra', desc: '先锋实验' },
      { id: FontStyle.WILD_CREEP, name: 'Creepster', desc: '惊悚艺术' },
    ]
  },
  {
    name: '极致秀丽 (Elegant & Script)',
    fonts: [
      { id: FontStyle.LUXE_MONSIEUR, name: 'Monsieur La Doulaise', desc: '极致拉丝花体' },
      { id: FontStyle.LUXE_VIBES, name: 'Great Vibes', desc: '流线华丽' },
      { id: FontStyle.LUXE_PINYON, name: 'Pinyon Script', desc: '宫廷古典' },
      { id: FontStyle.LUXE_PARISIENNE, name: 'Parisienne', desc: '浪漫法式' },
      { id: FontStyle.LUXE_ITALIANNO, name: 'Italianno', desc: '柔情意大利' },
      { id: FontStyle.LUXE_DECO, name: 'Cinzel Decorative', desc: '艺术装饰' },
    ]
  },
  {
    name: '肆意潦草 (Raw & Scribble)',
    fonts: [
      { id: FontStyle.RAW_REENIE, name: 'Reenie Beanie', desc: '极细涂鸦' },
      { id: FontStyle.RAW_ZEYADA, name: 'Zeyada', desc: '匆忙草写' },
      { id: FontStyle.RAW_NANUM, name: 'Nanum Pen', desc: '自然水笔' },
      { id: FontStyle.RAW_GRACE, name: 'Covered By Your Grace', desc: '个性马克笔' },
      { id: FontStyle.RAW_JUST_HAND, name: 'Just Another Hand', desc: '瘦长笔迹' },
    ]
  },
  {
    name: '异域黑暗 (Alternative Art)',
    fonts: [
      { id: FontStyle.GOTHIC, name: 'UnifrakturMaguntia', desc: '沉郁哥特' },
    ]
  }
];

const FontPicker: React.FC<FontPickerProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedFont = fontGroups.flatMap(g => g.fonts).find(f => f.id === value);

  return (
    <div className="relative w-full">
      <label className="text-[9px] text-gray-400 font-black uppercase tracking-[0.2em] px-1 mb-2 block">
        艺术排版风格
      </label>
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-gray-50 border-2 border-transparent hover:border-indigo-100 rounded-2xl px-5 py-4 transition-all text-left"
      >
        <div className="flex flex-col">
          <span className="text-[10px] text-indigo-500 font-black uppercase tracking-widest leading-none mb-1">
            当前氛围
          </span>
          <span className="text-gray-950 font-black text-lg truncate max-w-[200px]" style={{ fontFamily: value }}>
            {selectedFont?.name}
          </span>
        </div>
        <ChevronDown size={20} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-[100] top-full left-0 w-full mt-2 bg-white/95 backdrop-blur-xl border border-gray-100 rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.15)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-h-[500px] overflow-y-auto p-2 space-y-4">
            {fontGroups.map((group) => (
              <div key={group.name} className="space-y-1">
                <div className="px-4 pt-3 pb-1 text-[9px] text-indigo-400 font-black uppercase tracking-[0.2em] border-b border-gray-50 mx-2 mb-2">
                  {group.name}
                </div>
                {group.fonts.map((font) => (
                  <button
                    key={font.id}
                    onClick={() => {
                      onChange(font.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-4 rounded-xl transition-all hover:bg-gray-50 group ${
                      value === font.id ? 'bg-indigo-50/50' : ''
                    }`}
                  >
                    <div className="flex flex-col items-start overflow-hidden">
                      <span 
                        className="text-2xl text-gray-900 group-hover:translate-x-1 transition-transform truncate w-full" 
                        style={{ fontFamily: font.id }}
                      >
                        {font.name}
                      </span>
                      <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">
                        {font.desc}
                      </span>
                    </div>
                    {value === font.id && (
                      <div className="bg-indigo-600 p-1 rounded-full text-white flex-shrink-0">
                        <Check size={12} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {isOpen && <div className="fixed inset-0 z-[90]" onClick={() => setIsOpen(false)} />}
    </div>
  );
};

export default FontPicker;
