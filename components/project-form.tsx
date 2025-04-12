"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { addProject, updateProject, getProjectById } from "@/utils/api";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/submit-button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { uploadAttachments } from "@/utils/supabase/upload";

interface Props {
  projectId?: string;
}

export default function ProjectForm({ projectId }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [designerId, setDesignerId] = useState<string | null>(null);
  const [designers, setDesigners] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(!!projectId);
  const [errors, setErrors] = useState<{ title?: string; description?: string; designerId?: string }>({});
  const router = useRouter();

  useEffect(() => {
    if (!projectId) return;

    getProjectById(projectId)
      .then((res: any) => {
        const project = res[0];
        if (!project) return;
        setTitle(project.title ?? "");
        setDescription(project.description ?? "");
        setDesignerId(project.designer_id ?? null);
      })
      .catch((err) => {
        console.error("Error cargando proyecto:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [projectId]);

  useEffect(() => {
    const fetchDesigners = async () => {
      const res = await fetch("/api/designers");
      const data = await res.json();
      setDesigners(data);
    };

    fetchDesigners();
  }, []);

  const handleSubmit = async () => {
    const newErrors: typeof errors = {};

    if (!title.trim()) newErrors.title = "El título es requerido.";
    if (!description.trim()) newErrors.description = "La descripción es requerida.";
    if (projectId && !designerId) newErrors.designerId = "Debes asignar un diseñador.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    let attachments: { name: string; url: string }[] = [];

    if (files.length > 0) {
      attachments = await uploadAttachments(files);
    }

    if (projectId) {
      await updateProject(projectId, {
        title,
        description,
        attachments: JSON.stringify(attachments),
        designer_id: designerId,
      });
    } else {
      await addProject({
        title,
        description,
        attachments: JSON.stringify(attachments),
      });
    }

    router.push("/projects");
  };

  if (isLoading) return <p className="text-sm text-zinc-500">Cargando...</p>;

  return (
    <div className="flex items-start gap-2 mb-4">
      <Link href="/projects" className="text-sm text-zinc-600 hover:text-zinc-800 transition-colors">
        <ArrowLeft className="w-5 h-5" color="white" />
      </Link>
      <form className="flex flex-col gap-4 w-full" action={handleSubmit}>
        <h1 className="text-2xl font-bold">
          {projectId ? "Editar proyecto" : "Nuevo proyecto"}
        </h1>

        <div>
          <Label>Título</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
        </div>

        <div>
          <Label>Descripción</Label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
        </div>

        <div>
          <Label>Archivos adjuntos</Label>
          <Input
            type="file"
            multiple
            accept="image/*,application/pdf"
            onChange={(e) => setFiles(Array.from(e.target.files || []))}
          />
        </div>

        {projectId && (
          <div>
            <Label>Diseñador asignado</Label>
            <Select value={designerId ?? ""} onValueChange={setDesignerId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccionar un diseñador" />
              </SelectTrigger>
              <SelectContent>
                {designers.map((designer) => (
                  <SelectItem key={designer.id} value={designer.id}>
                    {designer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.designerId && <p className="text-red-500 text-sm">{errors.designerId}</p>}
          </div>
        )}

        <SubmitButton pendingText="Guardando...">
          {projectId ? "Actualizar" : "Crear"}
        </SubmitButton>
      </form>
    </div>
  );
}
