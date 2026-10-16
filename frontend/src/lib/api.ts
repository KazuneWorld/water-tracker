import { Cup } from '@/types/cup';

// バックエンドAPIのベースURL (環境変数から取得、なければlocalhost:8000を使用)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

// 容器一覧を取得する API 通信関数
export async function fetchCups(): Promise<Cup[]> {
  const response = await fetch(`${API_BASE_URL}/cups`, {
    cache: 'no-store', // 常に最新のデータを取得
  });

  if (!response.ok) {
    throw new Error('容器一覧の取得に失敗しました');
  }

  return response.json();
}