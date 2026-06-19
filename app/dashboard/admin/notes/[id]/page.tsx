import { NoteEditorView } from "@/features/admin/notes/NoteEditorView";
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <NoteEditorView id={id} />;
}
