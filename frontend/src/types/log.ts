export interface CreateWaterLogInput {
  amount_ml: number;
}

export interface WaterLog {
  id: number;
  amount_ml: number;
  logged_at: string;
}