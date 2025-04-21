import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, Trash2 } from "lucide-react";
import { PenaltyService, PenaltyType } from "@/services/penalty";
import { Penalty, PenaltyFilteringParams } from "@/types/penalties";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import FilterBar from "@/components/common/FilterBar";
import { useNavigate } from "react-router-dom";

export default function Penalties() {
  const navigate = useNavigate();
  const [penalties, setPenalties] = useState<Penalty[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Partial<PenaltyFilteringParams>>({
    page: 1
  });
  const [penaltyToDelete, setPenaltyToDelete] = useState<Penalty | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const filterOptions = useMemo(() => {
    return {
      projects: PenaltyService.getProjectOptions(),
      penaltyTypes: PenaltyService.getPenaltyTypeOptions(),
      penaltyReasons: PenaltyService.getPenaltyReasonOptions(),
      operators: PenaltyService.getEmployeeOptions(),
    };
  }, []);

  useEffect(() => {
    loadPenalties();
  }, [filters]);

  const loadPenalties = async () => {
    try {
      setLoading(true);
      const data = await PenaltyService.getPenalties(filters);
      setPenalties(data);
    } catch (error) {
      console.error("Error loading penalties:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (newFilters: Record<string, any>) => {
    setFilters( ({
      ...newFilters,
      page: 1, 
    }));
  };

  const formatDate = (date: Date) => {
    return format(new Date(date), 'dd/MM/yyyy', { locale: es });
  };

  const getPenaltyBadgeVariant = (typeId: number) => {
    switch (typeId) {
      case PenaltyType.SUSPENSION: return "destructive";
      case PenaltyType.ORAL_OBSERVATION: return "outline";
      case PenaltyType.WRITTEN_OBSERVATION: return "secondary";
      case PenaltyType.DISMISSAL: return "destructive";
      default: return "default";
    }
  };

  const handleDeleteClick = (penalty: Penalty) => {
    setPenaltyToDelete(penalty);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!penaltyToDelete) return;

    try {
      const success = await PenaltyService.deletePenalty(penaltyToDelete.id);
      if (success) {
        toast({
          title: "¡Sanción eliminada!",
          description: `La sanción ${penaltyToDelete.identifier} ha sido eliminada correctamente.`,
          variant: "default",
        });
        loadPenalties(); 
      } else {
        toast({
          title: "Error",
          description: "No se pudo eliminar la sanción.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting penalty:", error);
      toast({
        title: "Error",
        description: "Ocurrió un error al eliminar la sanción.",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setPenaltyToDelete(null);
    }
  };

  const handleCreatePenalty = () => {
    navigate("/penalties/create");
  };

  const handleViewPenalty = (id: number) => {
    navigate(`/penalties/${id}/edit`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Sanciones</h1>
        <Button onClick={handleCreatePenalty}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Sanción
        </Button>
      </div>

      {/* Filters section */}
      <FilterBar
        filterTypes={["search", "project", "penalty_type", "penalty_reason", "date_range", "operator"]}
        initialFilters={filters}
        filterOptions={filterOptions}
        onFiltersChange={handleFiltersChange}
        searchPlaceholder="Buscar..."
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Identificador</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Proyecto</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Días de Susp.</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  Cargando sanciones...
                </TableCell>
              </TableRow>
            ) : penalties.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No se encontraron sanciones
                </TableCell>
              </TableRow>
            ) : (
              penalties.map((penalty) => (
                <TableRow key={penalty.id}>
                  <TableCell className="font-medium">{penalty.identifier}</TableCell>
                  <TableCell>{PenaltyService.getEmployeeName(penalty.employee_id)}</TableCell>
                  <TableCell>{PenaltyService.getProjectName(penalty.project_id)}</TableCell>
                  <TableCell>{formatDate(penalty.penalty_date)}</TableCell>
                  <TableCell>
                    <Badge variant={getPenaltyBadgeVariant(penalty.penalty_type_id)}>
                      {PenaltyService.getPenaltyTypeName(penalty.penalty_type_id)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {penalty.penalty_type_id === PenaltyType.SUSPENSION 
                      ? penalty.days_quantity 
                      : "-"
                    }
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleViewPenalty(penalty.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDeleteClick(penalty)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro de eliminar esta sanción?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente 
              la sanción {penaltyToDelete?.identifier}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
