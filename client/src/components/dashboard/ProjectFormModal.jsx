import { useState } from "react";
import { X } from "lucide-react";
import ErrorMessage from "../ui/ErrorMessage";

const emptyForm = {
  title: "",
  description: "",
  industry: "",
  stage: "Idea",
};

export default function ProjectFormModal({
  isOpen,
  mode = "create",
  initialValues,
  isSubmitting,
  error,
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState({
    title: initialValues?.title || emptyForm.title,
    description: initialValues?.description || emptyForm.description,
    industry: initialValues?.industry || emptyForm.industry,
    stage: initialValues?.stage || emptyForm.stage,
  });

  if (!isOpen) return null;

  const title = mode === "edit" ? "Edit Project" : "Create Project";
  const submitText = mode === "edit" ? "Save Changes" : "Create Project";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    onSubmit({
      title: form.title.trim(),
      description: form.description.trim(),
      industry: form.industry.trim(),
      stage: form.stage,
    });
  };

  return (
    <div className="modal-backdrop" role="presentation">
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-form-title"
      >
        <div className="modal__header">
          <div>
            <p className="eyebrow">Project Workspace</p>
            <h2 id="project-form-title" className="modal__title">
              {title}
            </h2>
          </div>

          <button
            type="button"
            className="icon-button"
            onClick={onClose}
            aria-label="Close modal"
            disabled={isSubmitting}
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          {error ? <ErrorMessage message={error} /> : null}

          <label className="form-field">
            <span>Project Name</span>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Example: Fintech launch studio"
              required
              disabled={isSubmitting}
            />
          </label>

          <label className="form-field">
            <span>Description</span>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Short summary of the venture idea"
              rows="4"
              disabled={isSubmitting}
            />
          </label>

          <div className="form-grid">
            <label className="form-field">
              <span>Industry</span>
              <input
                name="industry"
                value={form.industry}
                onChange={handleChange}
                placeholder="SaaS, healthtech, fintech"
                disabled={isSubmitting}
              />
            </label>

            <label className="form-field">
              <span>Stage</span>
              <select
                name="stage"
                value={form.stage}
                onChange={handleChange}
                disabled={isSubmitting}
              >
                <option value="Idea">Idea</option>
                <option value="MVP">MVP</option>
                <option value="Growth">Growth</option>
                <option value="Scale">Scale</option>
              </select>
            </label>
          </div>

          <div className="modal__actions">
            <button
              type="button"
              className="btn btn--secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn--primary"
              disabled={isSubmitting || !form.title.trim()}
            >
              {isSubmitting ? "Saving..." : submitText}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
