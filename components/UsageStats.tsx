
import React from 'react';
import { BarChart3, Users, Zap, ExternalLink, X } from 'lucide-react';
import { AppStats } from '../types';

interface UsageStatsProps {
  stats: AppStats;
  onClose: () => void;
}

const UsageStats: React.FC<UsageStatsProps> = ({ stats, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-xl font-serif-elegant flex items-center gap-2">
            <BarChart3 className="text-indigo-500" size={20} />
            使用统计
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
              <div className="text-indigo-400 text-xs font-bold uppercase mb-1">累计创作 (本地)</div>
              <div className="text-3xl font-serif-elegant text-indigo-900">{stats.localCreations}</div>
            </div>
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
              <div className="text-amber-500 text-xs font-bold uppercase mb-1">在线人数 (模拟)</div>
              <div className="text-3xl font-serif-elegant text-amber-900">{stats.simulatedLiveUsers}</div>
            </div>
          </div>

          {/* Integration Guide */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Zap size={16} className="text-amber-500" />
              如何追踪真实的全局数据？
            </h3>
            <div className="text-sm text-gray-500 leading-relaxed space-y-3">
              <p>为了解全球有多少用户正在使用您的应用，建议集成专业的分析工具：</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-1.5"></div>
                  <span><strong>Google Analytics 4:</strong> 最适合深入了解受众特征和行为。</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-1.5"></div>
                  <span><strong>Vercel Analytics:</strong> 如果部署在 Vercel，可实现零配置追踪。</span>
                </li>
              </ul>
            </div>
            
            <a 
              href="https://analytics.google.com" 
              target="_blank" 
              className="flex items-center justify-center gap-2 w-full py-3 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-black transition-all shadow-lg"
            >
              立即接入 GA4
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
        
        <div className="px-8 py-4 bg-gray-50 text-[10px] text-gray-400 text-center uppercase tracking-widest">
          以上数据仅反映您当前设备的本地记录
        </div>
      </div>
    </div>
  );
};

export default UsageStats;
