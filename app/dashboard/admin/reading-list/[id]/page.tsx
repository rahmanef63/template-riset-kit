import { ReadingEditorView } from "@/features/admin/reading-list/ReadingEditorView";
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ReadingEditorView id={id} />;
}
