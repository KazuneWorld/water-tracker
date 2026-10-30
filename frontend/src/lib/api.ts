import { Cup, CreateCupInput } from '@/types/cup';
import { CreateWaterLogInput, WaterLog } from '@/types/log';

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

// 新規容器を登録
export async function createCup(input: CreateCupInput): Promise<Cup> {
  const response = await fetch(`${API_BASE_URL}/cups`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('容器の登録に失敗しました');
  }

  return response.json();
}

// カップログ作成
export async function createWaterLog(input: CreateWaterLogInput): Promise<WaterLog> {
  const res = await fetch(`${API_BASE_URL}/logs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    throw new Error('記録に失敗しました');
  }

  return res.json();
}