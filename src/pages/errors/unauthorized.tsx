import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="flex h-[80vh] flex-col items-center justify-center text-center">
      <ShieldAlert className="h-24 w-24 text-destructive" />
      <h1 className="mt-4 text-3xl font-bold">Acceso no autorizado</h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        No tienes los permisos necesarios para acceder a esta página. 
        Por favor, contacta a un administrador si crees que esto es un error.
      </p>
      <div className="mt-6 flex space-x-4">
        <Button onClick={() => navigate(-1)}>
          Volver
        </Button>
        <Button variant="outline" onClick={() => navigate('/dashboard')}>
          Ir al Dashboard
        </Button>
      </div>
    </div>
  );
}
