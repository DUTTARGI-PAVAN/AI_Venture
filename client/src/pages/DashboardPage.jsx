import { useEffect } from "react";
import api from "../services/api";
import useStudioStore from "../store/useStudioStore";

export default function DashboardPage() {
  const { projects, setProjects, user } = useStudioStore();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    const { data } = await api.get("/projects");
    setProjects(data.projects);
  };

  return (
    <div>
      <h1>Welcome {user?.name}</h1>

      <h2>Projects</h2>

      <button
  onClick={async () => {
    const title = prompt("Project Name");

    if (!title) return;

    await api.post("/projects", {
      title,
    });

    const { data } = await api.get("/projects");

    setProjects(data.projects);
  }}
>
  New Project
</button>

<button
  onClick={() => {
    useStudioStore.getState().logout();
    window.location = "/auth";
  }}
>
  Logout
</button>

      {projects.map((p) => (
        <div key={p._id}>
          <h3>{p.title}</h3>
          <p>{p.description}</p>
        </div>
      ))}
    </div>
  );
}


