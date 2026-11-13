'use client';

import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

// 目標値の定数
export const DEFAULT_TARGET_AMOUNT = 2000;

interface WaterProgressBarProps {
  currentAmount: number;
  targetAmount?: number;
  onUpdateTarget?: (newTarget: number) => void; // 目標値更新時のコールバック
}

export function WaterProgressBar({
  currentAmount,
  targetAmount = DEFAULT_TARGET_AMOUNT,
  onUpdateTarget,
}: WaterProgressBarProps) {
  // インライン編集用の状態
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState<string>(String(targetAmount));

  // 親から渡される targetAmount が変わったら入力欄の初期値も同期
  useEffect(() => {
    setInputValue(String(targetAmount));
  }, [targetAmount]);

  // 達成率（上限なしの計算用とバー幅用の最大100%を分ける）
  const safeTarget = Math.max(targetAmount, 1);
  const isCompleted = currentAmount >= safeTarget;
  const percentage = isCompleted
    ? Math.round((currentAmount / safeTarget) * 100)
    : Math.min(Math.floor((currentAmount / safeTarget) * 100), 99);

  const targetBarWidth = Math.min((currentAmount / safeTarget) * 100, 100);

  // アニメーション用：最初は 0% からスタート
  const [animatedWidth, setAnimatedWidth] = useState<number>(0);

  // バーを伸ばすアニメーション
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedWidth(targetBarWidth);
    }, 50);

    return () => clearTimeout(timer);
  }, [targetBarWidth]);

  // 100% 達成時のクラッカー演出（バーが伸びたタイミングで発火）
  useEffect(() => {
    if (!isCompleted) return;

    // バーが伸びきるタイミングに合わせて発射
    const confettiTimer = setTimeout(() => {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { x: 0.2, y: 0.6 },
      });
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { x: 0.8, y: 0.6 },
      });
    }, 800);

    return () => clearTimeout(confettiTimer);
  }, [isCompleted]);

  // 編集開始
  const handleStartEdit = () => {
    if (!onUpdateTarget) return;
    setInputValue(String(targetAmount));
    setIsEditing(true);
  };

  // 保存処理（100ml〜3000mlなどの現実的な範囲でバリデーション）
  const handleSave = () => {
    const parsed = Number(inputValue);
    if (!Number.isFinite(parsed) || parsed < 100 || parsed > 3000) {
      alert('目標値は 100 〜 3,000 ml の間で入力してください');
      return;
    }
    onUpdateTarget?.(Math.round(parsed));
    setIsEditing(false);
  };

  // キャンセル処理
  const handleCancel = () => {
    setInputValue(String(targetAmount));
    setIsEditing(false);
  };

  return (
    <section className="bg-white rounded-xl p-5 border border-slate-200 mb-6">
      <div className="flex justify-between items-baseline mb-2">
        <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
          今日の目標達成率
        </span>
        <span
          className={`text-xl font-bold ${
            isCompleted ? 'text-teal-600' : 'text-blue-600'
          }`}
        >
          {percentage}%
        </span>
      </div>

      {/* プログレスバー */}
      <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${
            isCompleted ? 'bg-teal-500' : 'bg-blue-500'
          }`}
          style={{ width: `${animatedWidth}%` }}
        />
      </div>

      {/* 摂取量 / 目標量 */}
      <div className="flex justify-between items-center mt-2.5 text-sm text-slate-500 min-h-[32px]">
        <span>
          現在:{' '}
          <strong className="text-slate-800 text-base font-bold">
            {currentAmount.toLocaleString()}
          </strong>{' '}
          ml
        </span>

        {/* 目標値エリア：表示モードと入力モードを切り替え */}
        {isEditing ? (
          <div className="flex items-center gap-1.5">
            <span>目標:</span>
            <input
              type="number"
              step={100}
              min={100}
              max={3000}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') handleCancel();
              }}
              autoFocus
              className="w-20 px-2 py-0.5 text-right text-slate-800 font-semibold border border-slate-300 rounded focus:outline-none focus:border-blue-500"
            />
            <span>ml</span>
            <button
              type="button"
              onClick={handleSave}
              className="px-2 py-0.5 text-xs font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
            >
              保存
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-1.5 py-0.5 text-xs text-slate-500 hover:text-slate-700"
              aria-label="キャンセル"
            >
              ✕
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleStartEdit}
            title="クリックして目標値を変更"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 -mr-2 rounded-md bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 active:bg-slate-200 transition-colors cursor-pointer"
          >
            <span>
              目標:{' '}
              <span className="font-semibold text-slate-700">
                {targetAmount.toLocaleString()}
              </span>{' '}
              ml
            </span>
            <span className="text-xs text-slate-400">
              ✎
            </span>
          </button>
        )}
      </div>
    </section>
  );
}