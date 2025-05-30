export interface HealthData {
  id: number;
  created_at: string;
  beat_avg?: number | null;
  ir_value?: number | null;
  humidity?: number | null;
  temperature_c?: number | null;
  temperature_f?: number | null;
  heat_index_c?: number | null;
  heat_index_f?: number | null;
}
