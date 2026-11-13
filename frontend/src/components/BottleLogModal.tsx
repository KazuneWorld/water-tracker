'use client';

import { useEffect, useState } from 'react';

interface BottleLogModalProps {
  cupName: string;
  capacityMl: number;
  isOpen: boolean;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (amountMl: number) => void;
}

const MIN_PERCENT = 0;
const MAX_PERCENT = 100;

export function BottleLogModal({
  cupName,
  capacityMl,
  isOpen,
  submitting,
  onClose,
  onSubmit,
}: BottleLogModalProps) {
  const [selectedPercentage, setSelectedPercentage] = useState(100);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedPercentage(100);
      setIsDragging(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const selectedAmountMl = Math.round(
    (capacityMl * selectedPercentage) / 100,
  );

  // つまみの吹き出しを真上に追従させる
  const ratio =
    (selectedPercentage - MIN_PERCENT) / (MAX_PERCENT - MIN_PERCENT);
  const thumbLeftStyle = `calc(${ratio * 100}% + ${8 - ratio * 16}px)`;

  return (
    <div
      onClick={() => !submitting && onClose()}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="bg-white rounded-xl max-w-md w-full p-6 relative"
      >
        <h2 className="text-xl font-bold text-slate-800 mb-1">
          {cupName}の摂取量
        </h2>
        <p className="text-sm text-slate-500 mb-8">
          今日飲んだ割合をスライダーで指定してください。
        </p>

        {/* スライダー＋ドラッグ中のみ浮き出るパーセンテージ吹き出し */}
        <div className="relative pt-4 pb-1">
          {/* つまみを掴んでいる間だけ表示されるツールチップ */}
          <div
            style={{ left: thumbLeftStyle }}
            className={`pointer-events-none absolute -top-7 -translate-x-1/2 transition-all duration-150 ${
              isDragging
                ? 'opacity-100 scale-100 translate-y-0'
                : 'opacity-0 scale-90 translate-y-1'
            }`}
          >
            <div className="bg-slate-800 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-md whitespace-nowrap">
              {selectedPercentage}%
            </div>
            <div className="w-2 h-2 bg-slate-800 rotate-45 mx-auto -mt-1" />
          </div>

          <input
            type="range"
            min={MIN_PERCENT}
            max={MAX_PERCENT}
            step={5}
            value={selectedPercentage}
            onChange={(e) => setSelectedPercentage(Number(e.target.value))}
            onPointerDown={() => setIsDragging(true)}
            onPointerUp={() => setIsDragging(false)}
            onPointerCancel={() => setIsDragging(false)}
            onBlur={() => setIsDragging(false)}
            disabled={submitting}
            aria-label="飲んだ割合"
            style={{
              background: `linear-gradient(to right, #60a5fa ${selectedPercentage}%, #e2e8f0 ${selectedPercentage}%)`,
            }}
            className="w-full h-2.5 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />

          {/* メモリ両端のラベル */}
          <div className="flex justify-between text-xs font-medium text-slate-400 mt-1.5 select-none">
            <span>飲んでない</span>
            <span>完飲</span>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 mt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-2 text-sm font-medium text-slate-600 cursor-pointer hover:bg-slate-100 rounded-lg transition-colors"
          >
            キャンセル
          </button>
          <button
            type="button"
            onClick={() => onSubmit(selectedAmountMl)}
            disabled={submitting || selectedPercentage === 0}
            className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 cursor-pointer hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-default"
          >
            {submitting ? '記録中...' : '記録する'}
          </button>
        </div>
      </div>
    </div>
  );
}
