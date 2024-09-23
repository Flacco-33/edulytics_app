import { useState } from "react";
import { toast } from 'sonner';

export const useMediaPermissions = () => {
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [hasMicrophonePermission, setHasMicrophonePermission] = useState(false);

  const checkCameraPermission = async (): Promise<boolean> => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      setHasCameraPermission(true);
      return true;
    } catch (error) {
      toast.error('No se permite el acceso a la cámara. Por favor, compruebe la configuración de su navegador.', {
        position: 'top-right',
        richColors: true,
      });
      setHasCameraPermission(false);
      return false;
    }
  };

  const checkMicrophonePermission = async (): Promise<boolean> => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasMicrophonePermission(true);
      return true;
    } catch (error) {
      toast.error('No se permite el acceso al micrófono. Por favor, compruebe la configuración de su navegador.', {
        position: 'top-right',
        richColors: true,
      });
      setHasMicrophonePermission(false);
      return false;
    }
  };

  return {
    hasCameraPermission,
    hasMicrophonePermission,
    checkCameraPermission,
    checkMicrophonePermission,
  };
};
