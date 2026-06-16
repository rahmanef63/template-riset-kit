import { PublicationEditorView } from "@/components/templates/research/slices/admin/publications/PublicationEditorView";
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PublicationEditorView id={id} />;
}
