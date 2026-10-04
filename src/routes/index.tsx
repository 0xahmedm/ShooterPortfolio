import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";

const Game = lazy(() => import("@/game/Game").then((m) => ({ default: m.Game })));

export const Route = createFileRoute("/")({
  ssr: false,
  component: Index,
});

function Index() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="fixed inset-0 bg-[#1a1d23]" />;
  }

  return (
    <Suspense fallback={<div className="fixed inset-0 bg-[#1a1d23]" />}>
      <Game />
    </Suspense>
  );
}
