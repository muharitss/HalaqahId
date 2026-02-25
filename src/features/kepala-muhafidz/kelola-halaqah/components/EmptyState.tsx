import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import type { EmptyStateProps } from "../types";

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed rounded-xl opacity-50">
      <FontAwesomeIcon icon={faUsers} size="3x" className="mb-4" />
      <p>{message}</p>
    </div>
  );
}