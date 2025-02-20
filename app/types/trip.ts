export enum ActivityType {
  ACTIVITY = "activity",
  HOTEL = "hotel",
  RESTAURANT = "restaurant",
  FLIGHT = "flight",
  TRANSPORT = "transport",
  EVENT = "event",
  SIGHT = "sight",
  OTHER = "other",
}

export interface Activity {
  title: string;
  date: string;
  time: string;
  location: string;
  notes: string;
  type: ActivityType;
}

export interface TravelDay {
  date: string;
  hotel?: {
    name: string;
    address: string;
    checkIn?: string;
    checkOut?: string;
  };
  activities: Activity[];
}

export interface Trip {
  id: string;
  title: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  ownerId: string;
  partnerId?: string | null;
  status: string;
  imageUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface DatabaseTrip {
  id: string;
  title: string;
  destination: string;
  start_date: string;
  end_date: string;
  owner_id: string;
  partner_id?: string | null;
  status: string;
  image_url?: string | null;
  created_at: string;
  updated_at: string;
}
