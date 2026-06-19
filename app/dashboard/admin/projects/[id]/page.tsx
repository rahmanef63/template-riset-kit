import { ProjectEditorView } from "@/features/admin/projects/ProjectEditorView";
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProjectEditorView id={id} />;
}
