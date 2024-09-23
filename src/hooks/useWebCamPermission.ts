// hooks/useMicrophonePermission.ts
import { useState } from "react";
import { toast } from 'sonner';

export const useWebCamPermission = () => {
  const [hasPermission, setHasPermission] = useState(false);

  const checkWebCamPermission = async (): Promise<boolean> => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      setHasPermission(true);
      return true;
    } catch (error) {
      
      toast.error('No se permite el acceso a la cámara. Por favor, compruebe la configuración de su navegador.', {
        position: 'top-right',
        richColors: true,
      });
      setHasPermission(false);
      return false;
    }
  };

  return { hasPermission, checkWebCamPermission };
};
