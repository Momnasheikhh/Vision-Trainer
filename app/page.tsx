import Navbar from '@/components/Navbar';
import Dock from '@/components/Dock';
import Hero from '@/components/sections/Hero';
import DataCollection from '@/components/sections/DataCollection';
import Training from '@/components/sections/Training';
import Evaluation from '@/components/sections/Evaluation';
import Inference from '@/components/sections/Inference';

export default function Home() {
  return (
    <main className="relative bg-[#0B0F19] overflow-x-hidden">
      <Navbar />
      <Hero />
      <DataCollection />
      <Training />
      <Evaluation />
      <Inference />
      <Dock />
    </main>
  );
}
