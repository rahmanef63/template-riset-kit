"use client";

import { ConceptListPage } from "@/features/_shared/concepts/ConceptListPage";
import { libraryAdapter } from "@/features/_app/concepts";

export function LibraryPage() {
  return <ConceptListPage adapter={libraryAdapter} />;
}
