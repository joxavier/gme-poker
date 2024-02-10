'use client';

import { AppHero } from '../ui/ui-layout';
import Portal from "../portal"


export default function DashboardFeature() {
  return (
    <div>
      <AppHero title="$GME" subtitle="Welcome to Gaming GameStop on Solana." />
      <div className="max-w-xl mx-auto py-6 sm:px-6 lg:px-8 text-center">
        <div className="space-y-2">

        <Portal></Portal>
        </div>
      </div>
    </div>
  );
}
