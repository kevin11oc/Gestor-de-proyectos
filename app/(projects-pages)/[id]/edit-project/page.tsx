import ProjectForm from "@/components/project-form";

interface Props {
  params: { id: string };
}

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params;

  return <ProjectForm projectId={id} />;
}

