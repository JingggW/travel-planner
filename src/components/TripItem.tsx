import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { TripItem as TripItemType } from "@/types";

interface TripItemProps {
  item: TripItemType;
  onDelete?: () => void;
}

export default function TripItem({ item, onDelete }: TripItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const getIcon = (type: string) => {
    switch (type) {
      case "accommodation":
        return "🏨";
      case "transportation":
        return "✈️";
      case "activity":
        return "📍";
      default:
        return "📌";
    }
  };

  const formatDateTime = (datetime: string) => {
    if (!datetime) return "";
    const date = new Date(datetime);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("trip_items")
        .delete()
        .eq("id", item.id);

      if (error) throw error;
      onDelete?.();
    } catch (error) {
      console.error("Error deleting trip item:", error);
      if (error instanceof Error) {
        alert(`Error deleting trip item: ${error.message}`);
      } else {
        alert("Error deleting trip item. Please try again.");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="trip-item hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
      <div className={`trip-item-icon ${item.type}`}>{getIcon(item.type)}</div>
      <div className="trip-item-content">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="trip-item-title">{item.title}</h3>
            <div className="trip-item-meta">
              {item.location && (
                <>
                  <span>{item.location}</span>
                  <span>•</span>
                </>
              )}
              {item.start_datetime && (
                <span>{formatDateTime(item.start_datetime)}</span>
              )}
            </div>
            {item.description && (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {item.description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <Link
              href={`/trips/${item.trip_id}/items/${item.id}/edit`}
              className="btn btn-outline btn-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
                className="mr-1"
              >
                <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
              </svg>
            </Link>
            <button
              onClick={handleDelete}
              className="btn btn-outline btn-error btn-sm"
              disabled={isDeleting}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
                className="mr-1"
              >
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                <path
                  fillRule="evenodd"
                  d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="trip-item-actions mt-2">
          <span className={`tag ${item.type}`}>
            {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
          </span>
        </div>
      </div>
    </div>
  );
}
