'use client';

import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

interface WaterProgressBarProps {
  currentAmount: number;
  targetAmount?: number; // デフォルト 2000ml
}

export function WaterProgressBar({
  currentAmount,
  targetAmount = 2000,
}: WaterProgressBarProps) {
  // 達成率（上限なしの計算用とバー幅用の最大100%を分ける）
  const percentage = Math.round((currentAmount / targetAmount) * 100);
  const targetBarWidth = Math.min(percentage, 100);
  const isCompleted = percentage >= 100;

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
      <div className="flex justify-between items-center mt-2.5 text-sm text-slate-500">
        <span>
          現在:{' '}
          <strong className="text-slate-800 text-base font-bold">
            {currentAmount.toLocaleString()}
          </strong>{' '}
          ml
        </span>
        <span>目標: {targetAmount.toLocaleString()} ml</span>
      </div>
    </section>
  );
}