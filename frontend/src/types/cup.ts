export interface Cup {
  id: number;
  name: string;
  capacity_ml: number;
  color: string;
  type: 'cup' | 'bottle';
}

// 新規容器登録用の型定義
export type CreateCupInput = Omit<Cup, 'id'>;