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
  startDate: string;
  endDate: string;
  imageUrl?: string;
  partner?: string;
}
