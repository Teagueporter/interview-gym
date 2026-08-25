import { notFound } from "next/navigation";
import { getDrill } from "@/data/drills";
import { DrillRunner } from "@/components/DrillRunner";

export default async function DrillPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ session?: string }> }) {
  const { id } = await params;
  const drill = getDrill(id);
  if (!drill) notFound();
  const { session } = await searchParams;
  return <DrillRunner drill={drill} sessionIds={session?.split(",") ?? []} />;
}

