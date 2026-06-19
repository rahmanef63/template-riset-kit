import { PublicationsDetailPage } from "@/features/publications/PublicationsDetailPage";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <PublicationsDetailPage slug={slug} />;
}
