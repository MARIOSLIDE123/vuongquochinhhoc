import React, { useState, useEffect } from 'react';
import { LeaderboardEntry, StudentProfile } from '../types/math';
import { dataService } from '../services/dataService';
import { soundService } from '../services/soundService';
import { Trophy, Medal, RefreshCw, AlertCircle, ShieldCheck, ArrowLeft } from 'lucide-react';

interface LeaderboardViewProps {
  currentStudent: StudentProfile;
  onBackToHome: () => void;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  currentStudent,
  onBackToHome
}) => {
  const [period, setPeriod] = useState<'today' | 'week' | 'all'>('all');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isDemo, setIsDemo] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchBoard = async () => {
    setIsLoading(true);
    try {
      const res = await dataService.getLeaderboard(period, currentStudent);
      setEntries(res.entries);
      setIsDemo(res.isDemo);
    } catch {
      // Ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBoard();
  }, [period]);

  return (
    <div className="w-full max-w-3xl mx-auto space-y-5">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 rounded-3xl p-6 text-amber-950 shadow-xl border-4 border-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-amber-900/10 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2">
            <Trophy className="w-3.5 h-3.5 text-amber-900" />
            <span>Vinh Danh Trạng Nguyên Toán Học</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black">BẢNG XẾP HẠNG TOÀN QUỐC</h1>
          <p className="text-amber-900/80 text-xs md:text-sm font-medium mt-1">
            Ghi nhận thành tích học tập và sự kiên trì của các bạn nhỏ khắp mọi miền đất nước!
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchBoard}
            disabled={isLoading}
            className="p-3 bg-white/80 hover:bg-white rounded-2xl text-amber-950 shadow-sm font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Làm mới</span>
          </button>
        </div>
      </div>

      {/* DEMO NOTICE BANNER */}
      {isDemo && (
        <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-900 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-extrabold uppercase tracking-wide">
              Đang hiển thị Chế Độ Xem Thử (DEMO)
            </p>
            <p className="leading-relaxed">
              Bảng xếp hạng đang sử dụng dữ liệu mẫu và điểm số trên máy của con. Khi đường link Google Sheet được cài đặt trực tiếp trong mã nguồn, hệ thống sẽ tự động đồng bộ điểm số thực toàn quốc!
            </p>
          </div>
        </div>
      )}

      {/* Segmented Period Tabs */}
      <div className="flex items-center justify-center p-1.5 bg-slate-100 rounded-2xl max-w-sm mx-auto border border-slate-200">
        <button
          type="button"
          onClick={() => {
            soundService.playClick();
            setPeriod('today');
          }}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            period === 'today' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Hôm nay
        </button>
        <button
          type="button"
          onClick={() => {
            soundService.playClick();
            setPeriod('week');
          }}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            period === 'week' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Tuần này
        </button>
        <button
          type="button"
          onClick={() => {
            soundService.playClick();
            setPeriod('all');
          }}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            period === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Tích lũy toàn quốc
        </button>
      </div>

      {/* Leaderboard Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <div className="col-span-2 text-center">Hạng</div>
          <div className="col-span-6">Tên học sinh</div>
          <div className="col-span-4 text-right">Điểm tích lũy</div>
        </div>

        {/* Entries List */}
        <div className="divide-y divide-slate-100">
          {entries.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm font-medium">
              Chưa có dữ liệu bảng xếp hạng cho khoảng thời gian này.
            </div>
          ) : (
            entries.map((entry) => {
              const isTop1 = entry.rank === 1;
              const isTop2 = entry.rank === 2;
              const isTop3 = entry.rank === 3;

              return (
                <div
                  key={entry.studentId}
                  className={`grid grid-cols-12 gap-2 px-4 py-3.5 items-center transition-colors ${
                    entry.isCurrentUser
                      ? 'bg-amber-50/80 border-l-4 border-l-amber-500'
                      : 'hover:bg-slate-50/60'
                  }`}
                >
                  {/* Rank */}
                  <div className="col-span-2 flex justify-center items-center">
                    {isTop1 ? (
                      <span className="w-8 h-8 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center font-black text-sm shadow-sm ring-2 ring-amber-200">
                        🥇 1
                      </span>
                    ) : isTop2 ? (
                      <span className="w-8 h-8 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center font-black text-sm shadow-sm ring-2 ring-slate-100">
                        🥈 2
                      </span>
                    ) : isTop3 ? (
                      <span className="w-8 h-8 rounded-full bg-amber-700/20 text-amber-900 flex items-center justify-center font-black text-sm shadow-sm ring-2 ring-amber-100">
                        🥉 3
                      </span>
                    ) : (
                      <span className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs">
                        #{entry.rank}
                      </span>
                    )}
                  </div>

                  {/* Name and School Info (Privacy-preserving) */}
                  <div className="col-span-6">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-extrabold text-slate-800 text-sm">
                        {entry.displayName}
                      </span>
                      {entry.isCurrentUser && (
                        <span className="text-[10px] bg-amber-500 text-white font-black px-1.5 py-0.5 rounded-full">
                          BẠN
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                      <span>Lớp {entry.className}</span>
                      <span>·</span>
                      <span className="truncate max-w-[140px]">{entry.school}</span>
                    </div>
                  </div>

                  {/* Points and Badges */}
                  <div className="col-span-4 text-right">
                    <div className="font-black text-base text-amber-600 flex items-center justify-end gap-1">
                      <span>{entry.points}</span>
                      <span className="text-xs text-slate-400 font-bold">điểm</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium">
                      Đã hoàn thành: {entry.completedCount} câu
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Privacy note */}
      <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>
          Bảo vệ thông tin cá nhân của học sinh: Hệ thống chỉ hiển thị tên hiển thị, khối lớp và tên trường thu gọn.
        </span>
      </div>

      {/* Back button */}
      <button
        type="button"
        onClick={onBackToHome}
        className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl border border-slate-300 flex items-center justify-center gap-2 cursor-pointer text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Quay về Trang Chủ</span>
      </button>
    </div>
  );
};
