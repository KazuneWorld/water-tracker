'use client';

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
  const barWidth = Math.min(percentage, 100);
  const isCompleted = percentage >= 100;

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
          className={`h-full rounded-full transition-all duration-500 ease-out ${
            isCompleted ? 'bg-teal-500' : 'bg-blue-500'
          }`}
          style={{ width: `${barWidth}%` }}
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