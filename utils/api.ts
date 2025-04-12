export const getProjects = async () => {
  const res = await fetch("/api/projects");
  return res.json();
};

export const getProjectById = async (id: string) => {
  const res = await fetch(`/api/projects/${id}`);
  return res.json();
};

export const addProject = async (project: {
  title: string;
  description: string;
  attachments: string;
}) => {
  const res = await fetch("/api/projects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(project),
  });
  return res.json();
};

export const updateProject = async (id: string, data: any) => {
  const res = await fetch(`/api/projects/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteProject = async (id: string) => {
  const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
  return res.json();
};
