import { LogOut, Plus } from "lucide-react";

export default function TopNavbar({ user, onCreateProject, onLogout }) {
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">AI Venture Studio</p>
        <h1 className="topbar__title">
          Welcome{user?.name ? `, ${user.name}` : ""}.
        </h1>
      </div>

      <div className="topbar__actions">
        {onCreateProject ? (
          <button type="button" className="btn btn--primary" onClick={onCreateProject}>
            <Plus size={18} aria-hidden="true" />
            New Project
          </button>
        ) : null}

        <button type="button" className="btn btn--secondary" onClick={onLogout}>
          <LogOut size={18} aria-hidden="true" />
          Logout
        </button>
      </div>
    </header>
  );
}
