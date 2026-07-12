import {
  Edit,
  ExternalLink,
  Trash2,
  Users,
} from "lucide-react";

function getProjectValue(value, fallback) {
  return value && String(value).trim() ? value : fallback;
}

export default function ProjectCard({
  project,
  onOpen,
  onEdit,
  onDelete,
  onBoardroom,
}) {
  const title = getProjectValue(project?.title, "Untitled Project");
  const description = getProjectValue(
    project?.description,
    "No description added yet."
  );
  const industry = getProjectValue(project?.industry, "Not specified");
  const stage = getProjectValue(project?.stage, "Idea");
  const projectId = project?._id;

  return (
    <article className="project-card">
      <div className="project-card__header">
        <div>
          <h3 className="project-card__title">{title}</h3>
          <p className="project-card__industry">{industry}</p>
        </div>
        <span className="project-card__badge">{stage}</span>
      </div>

      <p className="project-card__description">{description}</p>

      <div className="project-card__footer">
        {onEdit ? (
          <button
            type="button"
            className="btn btn--secondary btn--small"
            onClick={() => onEdit(project)}
          >
            <Edit size={16} aria-hidden="true" />
            Edit
          </button>
        ) : null}

        {onDelete ? (
          <button
            type="button"
            className="btn btn--danger btn--small"
            onClick={() => onDelete(projectId)}
          >
            <Trash2 size={16} aria-hidden="true" />
            Delete
          </button>
        ) : null}

        {onBoardroom ? (
          <button
            type="button"
            className="btn btn--secondary btn--small"
            onClick={() => onBoardroom(projectId)}
          >
            <Users size={16} />
            Boardroom
          </button>
        ) : null}

        {onOpen ? (
          <button
            type="button"
            className="btn btn--primary btn--small"
            onClick={() => onOpen(projectId)}
          >
            <ExternalLink size={16} aria-hidden="true" />
            Open
          </button>
        ) : null}
      </div>
    </article>
  );
}
