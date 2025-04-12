"use client";
import { useEffect, useState } from "react";
import { getProjects, deleteProject } from "@/utils/api";
import { Button } from "@/components/ui/button";
import { CirclePlus, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useUserRole } from "@/hooks/useUserRole";
import { ProjectTable } from "@/components/table-projects";

interface Projects {
  id: string;
  title: string;
  description: string;
  created_at: string;
  attachments?: string | { name: string; url: string }[];
  designer_name: string;
}

export default function Projects() {
  const role = useUserRole();
  const [projects, setProjects] = useState<Projects[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setIsLoading(true);
    const data = await getProjects();

    const parsedData: Projects[] = data.map((project: any) => ({
      ...project,
      designer_name: project.profiles?.name ?? "No asignado",
    }));

    setProjects(parsedData);
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    await deleteProject(id);
    setProjects(projects.filter((p) => p.id !== id));
  };

  if (isLoading) return <p className="text-sm text-zinc-500">Cargando...</p>;

  return (
    <div className="container">
      <h1 className="text-center text-xl">Gestión de Proyectos</h1>
      {role === "client" && (
        <div className="flex justify-end">
          <Button className="text-green-400 mb-5" variant="ghost">
            <CirclePlus className="text-green-400" />
            <Link href="/create-project">Nuevo Proyecto</Link>
          </Button>
        </div>
      )}
      <ProjectTable data={projects} role={role} onDelete={handleDelete} />
      {projects.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-sm text-gray-500">No hay proyectos disponibles.</p>
        </div>
      )}
    </div>
  );
}
