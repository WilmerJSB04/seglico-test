import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex h-[80vh] flex-col items-center justify-center text-center">
      <h1 className="text-9xl font-bold text-muted-foreground">404</h1>
      <h2 className="mt-4 text-2xl font-semibold">Página no encontrada</h2>
      <p className="mt-2 text-muted-foreground">
        La página que estás buscando no existe o ha sido movida.
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
