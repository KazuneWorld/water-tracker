export interface Cup {
  id: number;
  name: string;
  capacity_ml: number;
  color: string;
  type: 'cup' | 'bottle';
}