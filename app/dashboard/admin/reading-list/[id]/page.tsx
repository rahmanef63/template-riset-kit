import { ReadingEditorView } from "@/components/templates/research/slices/admin/reading-list/ReadingEditorView";
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ReadingEditorView id={id} />;
}
