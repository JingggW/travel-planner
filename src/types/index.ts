export interface Trip {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  description?: string;
  location?: string;
  budget?: number;
  travel_partner?: string;
  start_date?: string;
  end_date?: string;
  user_id: string;
  shared_with_user_id?: string;
}

export type TripItem = {
  id: string;
  trip_id: string;
  type: "activity" | "accommodation" | "transportation";
  title: string;
  description: string | null;
  start_datetime: string | null;
  end_datetime: string | null;
  location: string | null;
  created_at: string;
  updated_at: string;
};
