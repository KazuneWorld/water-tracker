'use client';

import { useState } from 'react';
import { Cup } from '@/types/cup';
import { createWaterLog } from '@/lib/api';

interface CupCardProps {
  cup: Cup;
  onLogSuccess?: () => void;
}

export function CupCard({ cup, onLogSuccess }: CupCardProps) {
  const [loading, setLoading] = useState(false);
  const isBottle = cup.type === 'bottle';

  const handleClick = async () => {
    // 水筒の場合は Issue #10 で実装するためスキップ
    if (isBottle || loading) return;

    setLoading(true);
    try {
      await createWaterLog({ amount_ml: cup.capacity_ml });
      onLogSuccess?.();
    } catch (error) {
      console.error(error);
      alert('記録に失敗しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading || isBottle}
      className={`w-full border rounded-lg p-4 bg-white flex flex-col justify-between items-center text-center transition-all ${
        isBottle
          ? 'cursor-default'
          : 'cursor-pointer hover:bg-slate-200 active:scale-95'
      } ${loading ? 'opacity-50 pointer-events-none' : ''}`}
    >
      {/* 容器名と容量 */}
      <h3 className="font-bold text-gray-800 text-base truncate w-full">
        {cup.name}
      </h3>
      <p className="text-gray-500 font-medium">{cup.capacity_ml} ml</p>

      {/* 容器タイプラベル */}
      <span
        className={`mt-3 text-xs px-2.5 py-1 rounded-full font-semibold ${
          isBottle ? 'bg-teal-200' : 'bg-blue-200'
        }`}
      >
        {loading
          ? '記録中...'
          : isBottle
            ? '水筒 (1日1回)'
            : 'コップ (ワンタップ)'}
      </span>
    </button>
  );
}