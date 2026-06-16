import { InsightEditorView } from "@/components/templates/research/slices/admin/insights/InsightEditorView";
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <InsightEditorView id={id} />;
}
