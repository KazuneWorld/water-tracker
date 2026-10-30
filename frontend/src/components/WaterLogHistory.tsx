'use client';

import { useState } from 'react';
import { WaterLog } from '@/types/log';
import { deleteWaterLog } from '@/lib/api';

interface WaterLogHistoryProps {
  logs: WaterLog[];
  onDataChange: () => void;
}

export function WaterLogHistory({ logs, onDataChange }: WaterLogHistoryProps) {
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const handleDelete = async (logId: number) => {
    if (!confirm('この記録を削除しますか？')) return;

    setLoadingId(logId);
    try {
      await deleteWaterLog(logId);
      onDataChange();
    } catch (err) {
      console.error(err);
      alert('削除に失敗しました');
    } finally {
      setLoadingId(null);
    }
  };

  // 時刻フォーマット（HH:MM）
  const formatTime = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <section className="mt-8">
      <h2 className="text-base font-bold text-slate-800 mb-3 text-left">
        本日の履歴
      </h2>

      <div className="bg-white rounded-xl p-4 border border-slate-200">
        {logs.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-6">
            今日の記録はまだありません。
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {logs.map((log) => {
              const isLoading = loadingId === log.id;

              return (
                <li
                  key={log.id}
                  className="py-3 flex items-center justify-between text-sm"
                >
                  {/* 記録時刻 */}
                  <span className="text-slate-400 text-xs w-16">
                    {formatTime(log.logged_at)}
                  </span>

                  {/* 摂取量 */}
                  <span className="font-semibold text-slate-700 flex-1">
                    {log.amount_ml}{' '}
                    <span className="text-xs font-normal text-slate-500">ml</span>
                  </span>

                  {/* 取り消しボタン */}
                  <button
                    type="button"
                    onClick={() => handleDelete(log.id)}
                    disabled={isLoading}
                    className="text-xs text-red-500 hover:text-red-600 transition-colors cursor-pointer underline underline-offset-2 p-1 disabled:opacity-50"
                  >
                    {isLoading ? '削除中...' : '取り消し'}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}