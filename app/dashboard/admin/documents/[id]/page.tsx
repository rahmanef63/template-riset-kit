import { DocumentEditorView } from "@/features/admin/documents/DocumentEditorView";
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <DocumentEditorView id={id} />;
}
