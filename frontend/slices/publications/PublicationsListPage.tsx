"use client";

import { ConceptListPage } from "@/features/_shared/concepts/ConceptListPage";
import { publicationsAdapter } from "@/features/_app/concepts";

export function PublicationsListPage() {
  return <ConceptListPage adapter={publicationsAdapter} />;
}
