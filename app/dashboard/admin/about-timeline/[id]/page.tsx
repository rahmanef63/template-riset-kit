import { AboutTimelineEditorView } from "@/features/admin/about/AboutTimelineEditorView";
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AboutTimelineEditorView id={id} />;
}
