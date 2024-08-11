'use client';
import MainMap from "@/components/map/MainMap";
export default function Home() {
  return (
    <main>
      <div className="flex items-center justify-center min-h-screen">
        <MainMap />
      </div>
    </main>
  );
}
