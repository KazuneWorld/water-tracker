'use client';

import { useState, useEffect } from 'react';
import { Cup } from '@/types/cup';
import { createWaterLog } from '@/lib/api';
import { BottleLogModal } from '@/components/BottleLogModal';

interface CupCardProps {
  cup: Cup;
  deletedLogId?: number | null;
  onLogSuccess?: (amountMl: number) => void;
}

// 今日の日付を取得
function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getStoredBottleLog(storageKey: string) {
  const value = localStorage.getItem(storageKey);
  if (!value) return null;

  try {
    const stored = JSON.parse(value);
    if (stored.date && typeof stored.logId === 'number') return stored;
  } catch {
    if (value === getTodayDateString()) return { date: value, logId: null };
  }

  return null;
}

export function CupCard({ cup, deletedLogId, onLogSuccess }: CupCardProps) {
  const [loading, setLoading] = useState(false);
  const [isBottleModalOpen, setIsBottleModalOpen] = useState(false);
  const [recordedToday, setRecordedToday] = useState(false);
  const isBottle = cup.type === 'bottle';
  const storageKey = `water-tracker-bottle-logged-${cup.id}`;

  useEffect(() => {
    if (!isBottle) return;
    const storedLog = getStoredBottleLog(storageKey);
    if (storedLog?.date === getTodayDateString()) {
      setRecordedToday(true);
    }
  }, [isBottle, storageKey]);

  useEffect(() => {
    if (!isBottle || deletedLogId == null) return;

    const storedLog = getStoredBottleLog(storageKey);
    const isLegacyLog =
      storedLog?.logId === null &&
      storedLog.date === getTodayDateString();
    if (storedLog?.logId !== deletedLogId && !isLegacyLog) return;

    localStorage.removeItem(storageKey);
    setRecordedToday(false);
  }, [deletedLogId, isBottle, storageKey]);

  const handleClick = async () => {
    if (loading || (isBottle && (recordedToday || isBottleModalOpen))) return;

    if (isBottle) {
      setIsBottleModalOpen(true);
      return;
    }

    await submitLog(cup.capacity_ml);
  };

  const submitLog = async (amountMl: number) => {
    setLoading(true);
    try {
      const createdLog = await createWaterLog({ amount_ml: amountMl });
      if (isBottle) {
        localStorage.setItem(
          storageKey,
          JSON.stringify({
            date: getTodayDateString(),
            logId: createdLog.id,
          }),
        );
        setRecordedToday(true);
        setIsBottleModalOpen(false);
      }
      onLogSuccess?.(amountMl);
    } catch (error) {
      console.error(error);
      alert('記録に失敗しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading || (isBottle && recordedToday)}
        className={`w-full border rounded-lg p-4 bg-white flex flex-col justify-between items-center text-center transition-all ${
          isBottle && recordedToday
            ? 'cursor-default bg-slate-200 opacity-60'
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
            isBottle && recordedToday
              ? 'bg-slate-200 text-slate-600'
              : isBottle
                ? 'bg-teal-200'
                : 'bg-blue-200'
          }`}
        >
          {loading
            ? '記録中...'
            : isBottle && recordedToday
              ? '本日記録済み'
              : isBottle
                ? '水筒 (1日1回)'
                : 'コップ (ワンタップ)'}
        </span>
      </button>

      {isBottle && (
        <BottleLogModal
          cupName={cup.name}
          capacityMl={cup.capacity_ml}
          isOpen={isBottleModalOpen}
          submitting={loading}
          onClose={() => setIsBottleModalOpen(false)}
          onSubmit={submitLog}
        />
      )}
    </>
  );
}
