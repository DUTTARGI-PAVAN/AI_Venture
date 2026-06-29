import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardStats from "../components/dashboard/DashboardStats";
import ProjectCard from "../components/dashboard/ProjectCard";
import ProjectFormModal from "../components/dashboard/ProjectFormModal";
import SidebarNavigation from "../components/layout/SidebarNavigation";
import TopNavbar from "../components/layout/TopNavbar";
import EmptyState from "../components/ui/EmptyState";
import ErrorMessage from "../components/ui/ErrorMessage";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import api from "../services/api";
import useStudioStore from "../store/useStudioStore";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { projects, setProjects, user, logout } = useStudioStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalError, setModalError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedProject, setSelectedProject] = useState(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  const loadProjects = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const { data } = await api.get("/projects");
      setProjects(data.projects || []);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Unable to load projects. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }, [setProjects]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadProjects();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadProjects]);

  const openCreateModal = () => {
    setModalMode("create");
    setSelectedProject(null);
    setModalError("");
    setIsProjectModalOpen(true);
  };

  const openEditModal = (project) => {
    setModalMode("edit");
    setSelectedProject(project);
    setModalError("");
    setIsProjectModalOpen(true);
  };

  const closeProjectModal = () => {
    if (isSaving) return;

    setIsProjectModalOpen(false);
    setSelectedProject(null);
    setModalError("");
  };

  const handleSubmitProject = async (payload) => {
    if (!payload.title) {
      setModalError("Project name is required.");
      return;
    }

    setIsSaving(true);
    setModalError("");

    try {
      if (modalMode === "edit" && selectedProject?._id) {
        const { data } = await api.put(
          `/projects/${selectedProject._id}`,
          payload
        );

        setProjects(
          projects.map((project) =>
            project._id === selectedProject._id ? data.project : project
          )
        );
      } else {
        const { data } = await api.post("/projects", payload);
        setProjects([data.project, ...projects]);
      }

      closeProjectModal();
    } catch (err) {
      setModalError(
        err?.response?.data?.message ||
          "Unable to save project. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!projectId) return;

    const confirmed = window.confirm(
      "Delete this project? This action cannot be undone."
    );

    if (!confirmed) return;

    setError("");

    try {
      await api.delete(`/projects/${projectId}`);
      setProjects(projects.filter((project) => project._id !== projectId));
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Unable to delete project. Please try again."
      );
    }
  };

  const handleOpenProject = (projectId) => {
    if (!projectId) return;
    navigate(`/projects/${projectId}`);
  };

  const handleLogout = () => {
    logout();
    navigate("/auth", { replace: true });
  };

  return (
    <div className="app-shell">
      <SidebarNavigation />

      <main className="main-content">
        <div className="content-stack">
          <TopNavbar
            user={user}
            onCreateProject={openCreateModal}
            onLogout={handleLogout}
          />

          <p className="page-intro">
            Manage every venture workspace from one focused dashboard. Create,
            review, and organize your startup projects as they move from idea
            to execution.
          </p>

          <DashboardStats projects={projects} />

          {error ? <ErrorMessage message={error} onRetry={loadProjects} /> : null}

          <section className="panel">
            <div className="panel__header">
              <div>
                <h2 className="panel__title">Projects</h2>
                <p className="panel__meta">
                  {projects.length} active{" "}
                  {projects.length === 1 ? "workspace" : "workspaces"}
                </p>
              </div>
            </div>

            {isLoading ? (
              <LoadingSpinner label="Loading projects..." />
            ) : projects.length > 0 ? (
              <div className="project-grid">
                {projects.map((project) => (
                  <ProjectCard
                    key={project._id}
                    project={project}
                    onOpen={handleOpenProject}
                    onEdit={openEditModal}
                    onDelete={handleDeleteProject}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No projects yet"
                message="Create your first venture workspace to start organizing your ideas."
                actionLabel="Create Project"
                onAction={openCreateModal}
              />
            )}
          </section>
        </div>
      </main>

      {isProjectModalOpen ? (
        <ProjectFormModal
          key={selectedProject?._id || modalMode}
          isOpen={isProjectModalOpen}
          mode={modalMode}
          initialValues={selectedProject}
          isSubmitting={isSaving}
          error={modalError}
          onClose={closeProjectModal}
          onSubmit={handleSubmitProject}
        />
      ) : null}
    </div>
  );
}
