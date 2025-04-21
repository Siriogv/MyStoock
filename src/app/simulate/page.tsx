;"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

export default function SimulationPage() {
  const router = useRouter();

  const goBackToDashboard = () => {
    router.push('/');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Simulation Page</h1>
       <Button variant="secondary" onClick={goBackToDashboard}>Back to Dashboard</Button>
      {/* TODO: Implement simulation logic here */}
    </div>
  );
}
