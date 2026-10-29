'use client';

import { useEffect, useState } from 'react';
import { Cup } from '@/types/cup';
import { fetchCups } from '@/lib/api';
import { CupCard } from '@/components/CupCard';
import { AddCupModal } from '@/components/AddCupModal';

export default function Home() {
  const [cups, setCups] = useState<Cup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadCups() {
      try {
        const data = await fetchCups();
        setCups(data);
      } catch (err) {
        setError(
          '容器データの取得に失敗しました。時間をおいて再度お試しください。',
        );
      } finally {
        setLoading(false);
      }
    }

    loadCups();
  }, []);

  const handleCupAdded = (newCup: Cup) => {
    setCups((prevCups) => [...prevCups, newCup]);
  };

  // コップ記録成功時の処理（ポップアップ表示）
  const handleLogSuccess = (amountMl: number, cupName: string) => {
    setToastMessage(`${cupName} (${amountMl}ml) を記録しました！`);

    setTimeout(() => {
      setToastMessage(null);
    }, 2500);

    // TODO: Issue #7 (進捗ゲージ) と Issue #8 (履歴リスト) 作成時にここで再取得を呼ぶ
  };

  return (
    <main className="relative min-h-screen bg-slate-50 p-6 max-w-2xl mx-auto">
      {/* 画面上部のトースト通知 */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 transition-all duration-300">
          <div className="bg-slate-800 text-white text-sm font-semibold px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2">
            <span className="text-blue-400">💧</span>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      <header className="mb-5 flex justify-between items-center">
        <div className="text-left">
          <h1 className="text-2xl font-bold">Water Tracker</h1>
          <p className="text-slate-500 text-sm">マイ容器一覧</p>
        </div>
        {/* 新規容器追加ボタン */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm cursor-pointer px-4 py-2 rounded-lg transition-colors flex items-center gap-1"
        >
          <span>＋</span> 容器を追加
        </button>
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
                <CupCard
                  key={cup.id}
                  cup={cup}
                  onLogSuccess={() => handleLogSuccess(cup.capacity_ml, cup.name)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* モーダルコンポーネントを配置 */}
      <AddCupModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleCupAdded}
      />
    </main>
  );
}