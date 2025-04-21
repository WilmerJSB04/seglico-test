import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Sanciones Pendientes</CardTitle>
            <CardDescription>Sanciones sin procesar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Sanciones Procesadas</CardTitle>
            <CardDescription>Total del mes actual</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Usuarios Activos</CardTitle>
            <CardDescription>Total de usuarios en el sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
