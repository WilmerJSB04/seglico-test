import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search } from "lucide-react";

// Mock data for penalties
const mockPenalties = [
  { id: 1, code: "P001", description: "Exceso de velocidad", status: "Pending", date: "2025-04-10" },
  { id: 2, code: "P002", description: "Estacionamiento prohibido", status: "Processed", date: "2025-04-05" },
  { id: 3, code: "P003", description: "Semáforo en rojo", status: "Pending", date: "2025-04-12" },
  { id: 4, code: "P004", description: "Sin cinturón de seguridad", status: "Processed", date: "2025-04-01" },
  { id: 5, code: "P005", description: "Documentación vencida", status: "Pending", date: "2025-04-15" },
];

export default function Penalties() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredPenalties = mockPenalties.filter(penalty => 
    penalty.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    penalty.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Sanciones</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Sanción
        </Button>
      </div>

      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input
          type="text"
          placeholder="Buscar sanciones..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
        <Button type="submit" size="icon">
          <Search className="h-4 w-4" />
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPenalties.map((penalty) => (
              <TableRow key={penalty.id}>
                <TableCell className="font-medium">{penalty.code}</TableCell>
                <TableCell>{penalty.description}</TableCell>
                <TableCell>
                  <Badge variant={penalty.status === "Pending" ? "outline" : "default"}>
                    {penalty.status === "Pending" ? "Pendiente" : "Procesado"}
                  </Badge>
                </TableCell>
                <TableCell>{penalty.date}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    Ver
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
