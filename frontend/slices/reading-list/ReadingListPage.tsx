"use client";

import { ConceptListPage } from "@/features/_shared/concepts/ConceptListPage";
import { readingListAdapter } from "@/features/_app/concepts";

export function ReadingListPage() {
  return <ConceptListPage adapter={readingListAdapter} />;
}
