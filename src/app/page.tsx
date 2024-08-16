'use client';
import MainMap from '@/components/map/MainMap';
import { ContextProvider } from '@/store/contextProvider';

export default function Home() {
  return (
    <ContextProvider>
      <main>
        <div className="flex items-center justify-center min-h-screen">
          <MainMap />
        </div>
      </main>
    </ContextProvider>
  );
}
