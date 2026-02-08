
import React, { useState, useCallback, useEffect } from 'react';
import { Download, Sparkles, Type, Move, Palette, MousePointer2, BarChart2, Activity } from 'lucide-react';
import { AvatarSettings, FontStyle, TextPosition, AppStats, TextTransform } from './types';
import AvatarPreview from './components/AvatarPreview';
import ColorWheel from './components/ColorWheel';
import UsageStats from './components/UsageStats';
import FontPicker from './components/FontPicker';

const App: React.FC = () => {
  const [settings, setSettings] = useState<AvatarSettings>({
    text: 'Untamed',
    color: '#34c759',
    fontSize: 110,
    fontStyle: FontStyle.WILD_METAL,
    position: TextPosition.CENTER,
    intensity: 95,
    auraSize: 85, // 默认光晕大小
    textTransform: 'uppercase',
    letterSpacing: 2,
  });

  const [stats, setStats] = useState<AppStats>({
    localCreations: parseInt(localStorage.getItem('aura_total_creations') || '0'),
    sessionCreations: 0,
    simulatedLiveUsers: Math.floor(Math.random() * 25) + 15
  });

  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        simulatedLiveUsers: Math.max(1, prev.simulatedLiveUsers + (Math.random() > 0.5 ? 3 : -3))
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleDownload = useCallback(() => {
    if (!canvasRef) return;
    const newTotal = stats.localCreations + 1;
    localStorage.setItem('aura_total_creations', newTotal.toString());
    setStats(prev => ({
      ...prev,
      localCreations: newTotal,
      sessionCreations: prev.sessionCreations + 1
    }));
    const link = document.createElement('a');
    link.download = `aura-art-${Date.now()}.png`;
    link.href = canvasRef.toDataURL('image/png');
    link.click();
  }, [canvasRef, stats]);

  const updateSetting = <K extends keyof AvatarSettings>(key: K, value: AvatarSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-[#fafafa]">
      <div className="mb-14 text-center relative">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="flex items-center gap-2 px-5 py-2 bg-black text-white rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-xl">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            当前有 {stats.simulatedLiveUsers} 位创作者在线
          </div>
        </div>
        <h1 className="text-7xl font-studio-title text-gray-950 mb-3 tracking-tighter flex items-center justify-center gap-5">
          <Sparkles className="text-amber-500 w-12 h-12" />
          Aura Master
        </h1>
        <p className="text-gray-400 font-bold text-[11px] tracking-[0.5em] uppercase">先锋光晕艺术实验室</p>
      </div>

      <div className="w-full max-w-[1400px] grid grid-cols-1 lg:grid-cols-12 gap-12 items-start px-4">
        <div className="lg:col-span-4 space-y-10 bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-[0_30px_90px_rgba(0,0,0,0.04)]">
          
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-gray-950 font-black uppercase text-xs tracking-widest">
              <Palette size={20} className="text-indigo-600" />
              <span>色彩层级</span>
            </div>
            <ColorWheel color={settings.color} onChange={(c) => updateSetting('color', c)} />
          </section>

          <section className="space-y-8">
            <div className="flex items-center gap-3 text-gray-950 font-black uppercase text-xs tracking-widest">
              <Type size={20} className="text-indigo-600" />
              <span>排版设计</span>
            </div>
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-[9px] text-gray-400 font-black uppercase tracking-[0.2em] px-1">输入文字</label>
                <input 
                  type="text" 
                  value={settings.text}
                  onChange={(e) => updateSetting('text', e.target.value)}
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-indigo-100 rounded-2xl px-6 py-5 outline-none transition-all text-gray-900 font-bold text-xl placeholder:text-gray-200"
                  placeholder="输入艺术文本..."
                />
              </div>
              
              <FontPicker 
                value={settings.fontStyle} 
                onChange={(f) => updateSetting('fontStyle', f)} 
              />

              <div className="grid grid-cols-2 gap-6 pt-2">
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] text-gray-400 font-black uppercase tracking-[0.2em] px-1">文字转换</label>
                  <div className="flex bg-gray-50 rounded-2xl p-2 border border-gray-100">
                    {(['none', 'uppercase', 'lowercase'] as TextTransform[]).map((t) => (
                      <button
                        key={t}
                        onClick={() => updateSetting('textTransform', t)}
                        className={`flex-1 py-2.5 text-[10px] font-black rounded-xl transition-all ${
                          settings.textTransform === t ? 'bg-white shadow-lg text-indigo-600 scale-105' : 'text-gray-400'
                        }`}
                      >
                        {t === 'none' ? 'Aa' : t === 'uppercase' ? 'AA' : 'aa'}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] text-gray-400 font-black uppercase tracking-[0.2em] px-1">字号</label>
                  <input 
                    type="number" 
                    value={settings.fontSize}
                    onChange={(e) => updateSetting('fontSize', parseInt(e.target.value) || 40)}
                    className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-5 py-4 outline-none text-gray-900 text-sm font-black"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex justify-between text-[9px] text-gray-400 font-black uppercase tracking-[0.2em] px-1">
                  <span>字间距 / 纵横比</span>
                  <span className="text-indigo-600 font-mono">{settings.letterSpacing}px</span>
                </div>
                <input 
                  type="range" 
                  min="-20" 
                  max="100" 
                  step="0.5"
                  value={settings.letterSpacing}
                  onChange={(e) => updateSetting('letterSpacing', parseFloat(e.target.value))}
                  className="w-full accent-indigo-600 h-2.5 bg-gray-100 rounded-full appearance-none cursor-pointer"
                />
              </div>
            </div>
          </section>

          <section className="space-y-6 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-3 text-gray-950 font-black uppercase text-xs tracking-widest">
              <Move size={20} className="text-indigo-600" />
              <span>氛围与构图</span>
            </div>
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: TextPosition.CENTER, label: '居中' },
                  { id: TextPosition.TOP_RIGHT, label: '右上' },
                  { id: TextPosition.BOTTOM_LEFT, label: '左下' },
                  { id: TextPosition.BOTTOM_RIGHT, label: '右下' }
                ].map((pos) => (
                  <button
                    key={pos.id}
                    onClick={() => updateSetting('position', pos.id)}
                    className={`px-5 py-4 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] transition-all ${
                      settings.position === pos.id 
                      ? 'bg-black text-white shadow-[0_15px_30px_rgba(0,0,0,0.2)] scale-105' 
                      : 'bg-gray-50 text-gray-400 hover:bg-white hover:border-gray-200'
                    }`}
                  >
                    {pos.label}
                  </button>
                ))}
              </div>
              
              <div className="flex flex-col gap-4">
                <div className="flex justify-between text-[9px] text-gray-400 font-black uppercase tracking-[0.2em]">
                  <span>光晕半径</span>
                  <span className="text-indigo-600 font-mono">{settings.auraSize}%</span>
                </div>
                <input 
                  type="range" 
                  min="20" 
                  max="150" 
                  value={settings.auraSize}
                  onChange={(e) => updateSetting('auraSize', parseInt(e.target.value))}
                  className="w-full accent-indigo-600 h-2.5 bg-gray-100 rounded-full appearance-none cursor-pointer"
                />
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex justify-between text-[9px] text-gray-400 font-black uppercase tracking-[0.2em]">
                  <span>光晕强度</span>
                  <span className="text-indigo-600 font-mono">{settings.intensity}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="250" 
                  value={settings.intensity}
                  onChange={(e) => updateSetting('intensity', parseInt(e.target.value))}
                  className="w-full accent-indigo-600 h-2.5 bg-gray-100 rounded-full appearance-none cursor-pointer"
                />
              </div>
            </div>
          </section>
        </div>

        <div className="lg:col-span-8 flex flex-col items-center gap-12 sticky top-8">
          <AvatarPreview settings={settings} onCanvasRef={setCanvasRef} />
          
          <div className="flex flex-wrap justify-center gap-8">
            <button 
              onClick={handleDownload} 
              className="group relative flex items-center gap-5 px-14 py-7 bg-gray-950 text-white rounded-[2.5rem] font-black shadow-[0_25px_50px_rgba(0,0,0,0.2)] hover:bg-black hover:-translate-y-2 transition-all active:scale-95 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/30 via-transparent to-purple-500/30 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <Download size={28} className="group-hover:animate-bounce" />
              <span className="text-xl tracking-widest text-white">导出艺术作品</span>
            </button>
            <button 
              onClick={() => {
                const colors = ['#000000', '#ff2d55', '#5856d6', '#34c759', '#ff9500', '#007aff', '#ff3b30', '#af52de', '#1d1d1f'];
                const texts = ['EGO', 'RARE', 'VOID', 'PURE', 'CHAOS', 'GHOST', 'SILK', 'UNBORN', 'SOLO', 'RAW'];
                const fonts = Object.values(FontStyle);
                
                const newFont = fonts[Math.floor(Math.random() * fonts.length)];
                let newSpacing = 0;
                let newSize = 80 + Math.random() * 120;
                let newTransform: TextTransform = 'none';

                if (newFont.includes('Bungee') || newFont.includes('Metal')) {
                   newTransform = 'uppercase';
                   newSpacing = -2 + Math.random() * 8;
                   newSize = 120 + Math.random() * 60;
                } else if (newFont.includes('Monsieur') || newFont.includes('Pinyon')) {
                   newSpacing = 0;
                   newSize = 70 + Math.random() * 50;
                } else if (newFont.includes('Reenie') || newFont.includes('Hand')) {
                   newSize = 60 + Math.random() * 40;
                   newSpacing = 2 + Math.random() * 5;
                }

                setSettings(prev => ({
                  ...prev,
                  color: colors[Math.floor(Math.random() * colors.length)],
                  text: texts[Math.floor(Math.random() * texts.length)],
                  fontStyle: newFont,
                  fontSize: Math.floor(newSize),
                  letterSpacing: Number(newSpacing.toFixed(1)),
                  textTransform: newTransform,
                  intensity: 60 + Math.random() * 120,
                  auraSize: 40 + Math.random() * 100,
                  position: Math.random() > 0.5 ? TextPosition.CENTER : [TextPosition.BOTTOM_LEFT, TextPosition.TOP_RIGHT][Math.floor(Math.random()*2)]
                }));
              }}
              className="flex items-center gap-5 px-14 py-7 bg-white text-gray-900 border-2 border-gray-50 rounded-[2.5rem] font-black shadow-2xl hover:bg-gray-50 hover:-translate-y-2 transition-all"
            >
              <MousePointer2 size={28} className="text-indigo-600" />
              <span className="text-xl tracking-widest">灵感随机</span>
            </button>
          </div>

          <div className="flex items-center gap-10 px-10 py-5 bg-white border border-gray-100 rounded-[2rem] shadow-sm">
             <div className="flex items-center gap-3 text-base text-gray-500 font-black tracking-widest">
               <Activity size={20} className="text-green-500" />
               <span>本次会话: {stats.sessionCreations} 件杰作</span>
             </div>
             <div className="h-8 w-[2px] bg-gray-100"></div>
             <button onClick={() => setIsStatsOpen(true)} className="flex items-center gap-3 text-base text-indigo-600 font-black hover:text-indigo-700 transition-all uppercase tracking-widest">
               <BarChart2 size={22} />
               统计分析
             </button>
          </div>
        </div>
      </div>
      <footer className="mt-32 text-gray-300 text-[12px] font-black uppercase tracking-[0.6em]">
        Aura Master Studio • 艺术至上 • Est. 2024
      </footer>
      {isStatsOpen && <UsageStats stats={stats} onClose={() => setIsStatsOpen(false)} />}
    </div>
  );
};

export default App;
