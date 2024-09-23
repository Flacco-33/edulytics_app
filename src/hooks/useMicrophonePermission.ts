// hooks/useMicrophonePermission.ts
import { useState } from "react";
import { toast } from 'sonner';

export const useMicrophonePermission = () => {
  const [hasPermission, setHasPermission] = useState(false);

  const checkMicrophonePermission = async (): Promise<boolean> => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasPermission(true);
      return true;
    } catch (error) {
        toast.dismiss()
      toast.error('No se permite el acceso al micrófono. Por favor, compruebe la configuración de su navegador.', {
        position: 'top-right',
        richColors: true,
      });
      setHasPermission(false);
      return false;
    }
  };

  return { hasPermission, checkMicrophonePermission };
};
