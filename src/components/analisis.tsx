"use client";
//<reference types="node" />
import "regenerator-runtime/runtime";
import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Camera,
  Mic,
  RotateCcw,
  Square,
  X,
  RefreshCw,
  ChevronRight,
} from "lucide-react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { LiveAudioVisualizer } from "react-audio-visualize";
import { toast } from "sonner";
import WebCam from "react-webcam";

import { useSpeechRecording } from "@/hooks/useSpeechRecording";
import { formatTime } from "@/helpers/timeFormatter";

import createSpeechServicesPonyfill from "web-speech-cognitive-services";
import { useVideoRecording } from "@/hooks/useVideoRecording";
import { useMediaPermissions } from "@/hooks/useMediaPermissions ";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import {storage} from '../firebaseConfig'; // Importa la inicialización de Firebase

import {uploadVideoToFirebase} from '../services/firebase'
import { MessageData, sendMessageToSQS } from "@/services/sqsService";

type AnalysisProps = {
  personName: string
  imageUrl: string
  idStudent:string
  idTeacher: string
  idCourse: string
}

const SUBSCRIPTION_KEY = process.env.NEXT_PUBLIC_AZURE_KEY;
const REGION = "eastus";
const { SpeechRecognition: AzureSpeechRecognition } =
  createSpeechServicesPonyfill({
    credentials: {
      region: REGION,
      subscriptionKey: SUBSCRIPTION_KEY,
    },
  });
SpeechRecognition.applyPolyfill(AzureSpeechRecognition);

function detectMobile() {
  if (
    navigator.userAgent.match(/Android/i) ||
    navigator.userAgent.match(/webOS/i) ||
    navigator.userAgent.match(/iPhone/i) ||
    navigator.userAgent.match(/iPad/i) ||
    navigator.userAgent.match(/iPod/i) ||
    navigator.userAgent.match(/BlackBerry/i) ||
    navigator.userAgent.match(/Windows Phone/i)
  ) {
    return true;
  } else {
    return false;
  }
}

export default function Analysis({
  personName,
  imageUrl,
  idStudent,
  idTeacher,
  idCourse,
}:AnalysisProps) {
   // Simulated static data from API
  //  const personName = "Magali Elizabeth Pedraza Lopez";
  //  const imageUrl = "https://i.pravatar.cc/300";
  //  const idStudent = "13TL1234"
  //  const idTeacher = "30TE8902"
  //  const idCourse = "BasesFilosoficas"


  const [selectedDevice, setSelectedDevice] = useState("");
  const [visualizerDimensions, setVisualizerDimensions] = useState({
    width: 0,
    height: 0,
  });
  const visualizerContainerRef = useRef<HTMLDivElement>(null);
  const { transcript, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();
  const [isRecording, setIsRecording] = useState(false);
  const [canRecording, setCanRecording] = useState<
    "destructive" | "default" | "disabled"
  >("default");
  //isRecording ? "destructive" : "default"
  const [isMobile, setIsMobile] = useState(false);

  const [currentStep, setCurrentStep] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(
    "¿Cómo fue tu experiencia general en este curso y qué destacarías del desempeño del docente?"
  );

  useEffect(() => {
    const mobileStatus = detectMobile();
    setIsMobile(mobileStatus);
  }, []); //

  const {
    recordingTime,
    startListening,
    stopListening,
    resetRecording,
    mediaRecorderRef,
    audioStream,
  } = useSpeechRecording();

  const {
    capturing,
    webcamRef,
    recorderChunks,
    videoUrl,
    facingMode,
    setVideoUrl,
    toggleFacingMode,
    handleStartCaptureClick,
    handleStopCaptureClick,
    handleDeleteVideo,
  } = useVideoRecording();

  const {
    hasCameraPermission,
    hasMicrophonePermission,
    checkCameraPermission,
    checkMicrophonePermission,
  } = useMediaPermissions();

  useEffect(() => {
    const updateVisualizerDimensions = () => {
      if (visualizerContainerRef.current) {
        const { width, height } =
          visualizerContainerRef.current.getBoundingClientRect();
        setVisualizerDimensions({ width, height });
      }
    };

    updateVisualizerDimensions();
    window.addEventListener("resize", updateVisualizerDimensions);

    return () => {
      window.removeEventListener("resize", updateVisualizerDimensions);
    };
  }, []);

  useEffect(() => {
    if (recorderChunks.length > 0) {
      const blob = new Blob(recorderChunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);
      setCanRecording("disabled");
    } else {
      setVideoUrl(null);
    }
  }, [recorderChunks]);

  const handleStartRecording = useCallback(() => {
    checkCameraPermission();
    checkMicrophonePermission();
    toast.dismiss();
    if (hasCameraPermission && hasMicrophonePermission) {
      startListening(resetTranscript, "es-MX");
      handleStartCaptureClick();
      setIsRecording(true);
      setCanRecording("destructive");
    }
  }, [
    hasCameraPermission,
    hasMicrophonePermission,
    startListening,
    resetTranscript,
    handleStartCaptureClick,
  ]);

  const handleStopRecording = useCallback(() => {
    stopListening();
    handleStopCaptureClick();
    setIsRecording(false);
    setCanRecording("destructive");
  }, [stopListening, handleStopCaptureClick]);

  const handleResetRecording = useCallback(() => {
    handleStopRecording();
    handleDeleteVideo();
    resetRecording(resetTranscript);
    setCanRecording("default");
  }, [handleStopRecording, handleDeleteVideo, resetRecording, resetTranscript]);

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="text-center p-4 text-red-500">
        Su navegador no soporta el reconocimiento de voz.
      </div>
    );
  }

  const handleUploadAndProceed = async () => {
    if(transcript === "" || transcript === undefined){
      toast.dismiss();
      toast.error('No se ha realizado ninguna transcripción.', { position: 'top-right', richColors: true });
      return;
    }
    try {
      toast.dismiss();
      toast.loading('Subiendo video...', { position: 'top-right', richColors: true });
  
      const metadata = {
        contentType: 'video/webm',
        customMetadata: {
          idStudent: idStudent,
          idTeacher: idTeacher,
          idCourse: idCourse,
          aspect: currentStep, 
          comment: transcript,
        },
      };
  
      const blob = new Blob(recorderChunks, { type: 'video/webm' });
      const result = await uploadVideoToFirebase(blob, metadata);
  
      if (result !== "400") {
        toast.dismiss();
        toast.success('Video guardado correctamente.', { position: 'top-right', richColors: true });
        console.log("Video subido correctamente:", result);
  
        if (currentStep < 4) {
          setCurrentStep((prev) => prev + 1);
          const questions = [
            "¿Cómo describirías las estrategias, métodos y técnicas que el docente utilizó para enseñarte, y cómo influyeron en el ambiente de aprendizaje?",
            "¿Cómo fue tu experiencia con las evaluaciones y la comunicación del docente durante el curso?",
            "¿Cómo fue el uso de tecnologías de la información y comunicación en el curso, y cómo contribuyeron a tu aprendizaje?",
          ];
          setCurrentQuestion(questions[currentStep - 1]);
          handleResetRecording();
        }
      } else {
        console.error("Error en la subida del video.");
        toast.dismiss();
        toast.error('Error en la subida del video, intenta de nuevo.', { position: 'top-right', richColors: true });
      }
    } catch (error) {
      console.error("Ocurrió un error durante el proceso de subida:", error);
      toast.dismiss();
      toast.error('Algo salió mal, intenta de nuevo.', { position: 'top-right', richColors: true });
    }
  };

  // Simulated devices
  const devices = [
    { id: "1", name: "Integrated Webcam" },
    { id: "2", name: "External USB Camera" },
    { id: "3", name: "Virtual Camera" },
  ];

  const test = async () => {
    const messageData: MessageData = {
      idStudent: "metadata.customMetadata.idStudent",
      idTeacher: "metadata.customMetadata.idTeacher",
      idCourse: "metadata.customMetadata.idCourse",
      aspect: 1, // Convierte a número si es necesario
      video_url: "downloadURL",  // Usamos el URL de descarga del video
    };
    
    try {
      await sendMessageToSQS(messageData);
      console.log('Mensaje enviado con éxito');
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
    }
  }
 
  return (
    <div className=" ">
      <Card className="mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 rounded-bl-lg">
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  step <= currentStep
                    ? "bg-primary-foreground text-primary"
                    : "bg-primary/50 text-primary-foreground/70"
                } transition-colors duration-200 ease-in-out`}
              >
                {step}
              </div>
            ))}
          </div>
        </div>
        <CardContent className="p-6 pt-10">
          <div className="flex items-start space-x-4">
            <img
              src={imageUrl}
              alt={personName}
              className="w-16 h-16 rounded-full"
            />
            <div className="flex-grow">
              <h2 className="text-2xl font-bold">{personName}</h2>
              <p className="text-sm text-muted-foreground">Impuestos</p>
              <h3 className="text-lg font-semibold mt-3 mb-4">
                {currentQuestion}
              </h3>
              <div className="flex justify-end">
                {/* <Button 
                  onClick={handleNext} 
                  variant="default"
                  aria-label="Siguiente pregunta"
                  disabled={currentStep === 4}
                  className="mt-2"
                >
                  Siguiente <ChevronRight className="w-4 h-4 ml-2" />
                </Button> */}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Select value={selectedDevice} onValueChange={setSelectedDevice}>
              <SelectTrigger id="device-select" className="flex-grow">
                <SelectValue placeholder="Elegir un dispositivo" />
              </SelectTrigger>
              <SelectContent>
                {devices.map((device) => (
                  <SelectItem key={device.id} value={device.id}>
                    {device.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {isMobile && (
              <Button
                variant="outline"
                size="icon"
                aria-label="Cambiar Camara"
                onClick={toggleFacingMode}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
          </div>
          <Card>
            <CardContent className="p-4">
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
                {videoUrl ? (
                  <video
                    src={videoUrl}
                    controls
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <WebCam
                    audio={false}
                    height={400}
                    width={600}
                    screenshotFormat="image/jpeg"
                    mirrored={false}
                    ref={webcamRef}
                    videoConstraints={{
                      height: 400,
                      width: 600,
                      facingMode: facingMode,
                    }}
                  />
                )}
                {(isRecording || capturing) && (
                  <div className="absolute top-2 right-2 flex items-center space-x-2 bg-red-500 text-white px-2 py-1 rounded-full">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    <span className="text-xs font-bold">REC</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          <div className="flex justify-center space-x-2 flex-wrap gap-2">
            <Button
              onClick={isRecording ? handleStopRecording : handleStartRecording}
              variant={canRecording}
              aria-label={
                isRecording
                  ? "Detener grabación de audio y video"
                  : "Iniciar grabación de audio y video"
              }
            >
              {isRecording ? (
                <>
                  <Square className="w-4 h-4 mr-2" /> Detener
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 mr-2" /> Iniciar
                </>
              )}
            </Button>

            <Button
              onClick={handleResetRecording}
              variant="outline"
              aria-label="Reiniciar grabación"
            >
              <RotateCcw className="w-4 h-4 mr-2" /> Reiniciar
            </Button>
            {/* <Button 
              onClick={stopListening} 
              variant="secondary"
              aria-label="Finalizar grabación"
            >
              <X className="w-4 h-4 mr-2" /> Finalizar
            </Button> */}
            {/* <Button
              onClick={test}
              variant="default"
              aria-label="Siguiente pregunta"
            >
              send sqs <ChevronRight className="w-4 h-4 ml-2" />
            </Button> */}

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                variant="default" 
                aria-label="Siguiente pregunta" 
                disabled={videoUrl === null}
                >
                  Siguiente <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Estas seguro?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Al dar click en continuar no se podra modificar el video ni la transcripccion, estas seguro?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleUploadAndProceed}>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        <div className="space-y-4">
          <Card className="h-[300px] flex flex-col">
            <CardContent className="p-4 flex-grow overflow-hidden flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold">Transcripción</h3>
                <span className="text-sm text-muted-foreground">
                  {formatTime(recordingTime)}
                </span>
              </div>
              <div className="flex-grow overflow-y-auto">
                {transcript ? (
                  <p>{transcript}</p>
                ) : (
                  <p className="text-center text-sm text-muted-foreground">
                    Aún no hay transcripción.
                  </p>
                )}
              </div>
            </CardContent>
            <div
              ref={visualizerContainerRef}
              className="p-4 border-t h-[120px] flex items-center justify-center"
            >
              {isRecording && audioStream ? (
                <LiveAudioVisualizer
                  mediaRecorder={mediaRecorderRef.current!}
                  width={visualizerDimensions.width}
                  height={visualizerDimensions.height}
                  barWidth={2}
                  gap={1}
                  barColor="hsl(var(--primary))"
                />
              ) : (
                <p className="text-sm text-muted-foreground">
                  El visualizador de audio aparecerá aquí durante la grabación.
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
