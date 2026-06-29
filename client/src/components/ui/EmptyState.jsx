import { FolderPlus } from "lucide-react";

export default function EmptyState({
  title = "Nothing here yet",
  message,
  actionLabel,
  onAction,
}) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">
        <FolderPlus size={24} aria-hidden="true" />
      </div>
      <h3>{title}</h3>
      {message ? <p>{message}</p> : null}
      {actionLabel && onAction ? (
        <button type="button" className="btn btn--primary" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
