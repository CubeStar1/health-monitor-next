export interface Activity {
  id: number;
  name: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  total_elevation_gain: number;
  type: string;
  start_date: string;
  max_heartrate?: number;
  average_heartrate?: number;
  average_speed: number;
  average_watts: number;
  calories:number;
}

export interface DetailedActivity extends Activity {
  splits_metric: {
    distance: number;
    elapsed_time: number;
    elevation_difference: number;
    moving_time: number;
    split: number;
    average_speed: number;
    pace_zone: number;
  }[];
  // Add other detailed fields as needed
}
