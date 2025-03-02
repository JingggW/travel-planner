export type Trip = {
  id: string;
  title: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
  shared_with_user_id: string | null;
};

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
