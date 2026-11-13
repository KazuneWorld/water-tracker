'use client';

import { useEffect, useState } from 'react';

const BOTTLE_PERCENTAGES = [100, 75, 50, 25];

interface BottleLogModalProps {
  cupName: string;
  capacityMl: number;
  isOpen: boolean;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (amountMl: number) => void;
}

export function BottleLogModal({
  cupName,
  capacityMl,
  isOpen,
  submitting,
  onClose,
  onSubmit,
}: BottleLogModalProps) {
  const [selectedPercentage, setSelectedPercentage] = useState(100);

  useEffect(() => {
    if (isOpen) setSelectedPercentage(100);
  }, [isOpen]);

  if (!isOpen) return null;

  const selectedAmountMl = Math.round(
    (capacityMl * selectedPercentage) / 100,
  );

  return (
    <div
      onClick={() => !submitting && onClose()}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="bg-white rounded-xl max-w-md w-full p-6 relative"
      >
        <h2 className="text-xl font-bold text-slate-800 mb-2">
          {cupName}の摂取量
        </h2>
        <p className="text-sm text-slate-500 mb-4">
          今日飲んだ割合を選択してください。
        </p>

        <div className="grid grid-cols-2 gap-3">
          {BOTTLE_PERCENTAGES.map((percentage) => (
            <button
              key={percentage}
              type="button"
              onClick={() => setSelectedPercentage(percentage)}
              className={`p-3 rounded-xl border-2 transition-all cursor-pointer ${
                selectedPercentage === percentage
                  ? 'border-blue-600 bg-blue-50/50 text-blue-700 font-bold'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
            >
              {percentage}%
              <span className="block text-xs font-normal mt-1">
                {Math.round((capacityMl * percentage) / 100)} ml
              </span>
            </button>
          ))}
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
            disabled={submitting}
            className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 cursor-pointer hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
          >
            {submitting ? '記録中...' : '記録する'}
          </button>
        </div>
      </div>
    </div>
  );
}
