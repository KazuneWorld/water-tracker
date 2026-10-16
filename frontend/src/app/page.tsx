'use client';

import { useEffect, useState } from 'react';
import { Cup } from '@/types/cup';
import { fetchCups } from '@/lib/api';
import { CupCard } from '@/components/CupCard';

export default function Home() {
  const [cups, setCups] = useState<Cup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCups() {
      try {
        const data = await fetchCups();
        setCups(data);
      } catch (err) {
        setError('容器データの取得に失敗しました。時間をおいて再度お試しください。');
      } finally {
        setLoading(false);
      }
    }

    loadCups();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 p-6 max-w-2xl mx-auto">
      <header className="mb-5">
        <h1 className="text-2xl font-bold">Water Tracker</h1>
        <p className="text-slate-500 text-sm">マイ容器一覧</p>
      </header>

      {/* ローディング状態 */}
      {loading && <p className="text-slate-500">データを読み込み中...</p>}

      {/* エラー状態 */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-4 text-sm">
          {error}
        </div>
      )}

      {/* 容器一覧グリッド表示 */}
      {!loading && !error && (
        <div>
          {cups.length === 0 ? (
            <p className="text-slate-400 text-center py-8">
              登録されている容器がありません。
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {cups.map((cup) => (
                <CupCard key={cup.id} cup={cup} />
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
}