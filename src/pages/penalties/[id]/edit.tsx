import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PenaltyForm } from "@/components/shared/penalties/PenaltyForm";
import { Penalty } from "@/types/penalties";
import { PenaltyService } from "@/services/penalty";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditPenalty() {
  const { id } = useParams<{ id: string }>();
  const [penalty, setPenalty] = useState<Penalty | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPenalty = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const penaltyId = parseInt(id);
        const penaltyData = await PenaltyService.getPenaltyById(penaltyId);
        
        if (!penaltyData) {
          setError("No se encontró la sanción solicitada");
          return;
        }
        
        setPenalty(penaltyData);
      } catch (error) {
        console.error("Error fetching penalty:", error);
        setError("Ocurrió un error al cargar la sanción");
      } finally {
        setLoading(false);
      }
    };

    fetchPenalty();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-[300px] w-full" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (error || !penalty) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold text-destructive">{error || "No se encontró la sanción"}</h2>
        <p className="mt-2">Vuelva a la pantalla anterior e intente nuevamente.</p>
      </div>
    );
  }

  return <PenaltyForm penalty={penalty} isEdit={true} />;
}
