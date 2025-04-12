import ProjectForm from "@/components/project-form";

type Props = {
  params: Promise<{ id: string }>
}

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params;

  return <ProjectForm projectId={id} />;
}