"use client"
//<reference types="node" />
import 'regenerator-runtime/runtime'
import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Camera, Mic, RotateCcw, Square, X, RefreshCw, Trash2 } from "lucide-react"
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import { LiveAudioVisualizer } from 'react-audio-visualize'
import { toast } from 'sonner'
import WebCam from 'react-webcam'

import { useSpeechRecording } from '@/hooks/useSpeechRecording'
import { formatTime } from '@/helpers/timeFormatter'

import createSpeechServicesPonyfill from 'web-speech-cognitive-services'


import { useVideoRecording } from '@/hooks/useVideoRecording'
import { useMediaPermissions } from '@/hooks/useMediaPermissions '

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {storage} from '../firebaseConfig'; // Importa la inicialización de Firebase

const SUBSCRIPTION_KEY = process.env.NEXT_PUBLIC_AZURE_KEY
const REGION = 'eastus'
const { SpeechRecognition: AzureSpeechRecognition } = createSpeechServicesPonyfill({
  credentials: {
    region: REGION,
    subscriptionKey: SUBSCRIPTION_KEY,
  }
})
SpeechRecognition.applyPolyfill(AzureSpeechRecognition)

function detectMobile(){
    if(
        navigator.userAgent.match(/Android/i) ||
        navigator.userAgent.match(/webOS/i) ||
        navigator.userAgent.match(/iPhone/i) ||
        navigator.userAgent.match(/iPad/i) ||
        navigator.userAgent.match(/iPod/i) ||
        navigator.userAgent.match(/BlackBerry/i) ||
        navigator.userAgent.match(/Windows Phone/i)
    )
        {
            return true
        }else{
            return false
    }
  }

export default function Temp() {
  const [selectedDevice, setSelectedDevice] = useState("")
  const [visualizerDimensions, setVisualizerDimensions] = useState({ width: 0, height: 0 })
  const visualizerContainerRef = useRef<HTMLDivElement>(null)
  const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition()
  const [isRecording, setIsRecording] = useState(false);
  const [canRecording, setCanRecording] = useState<"destructive" | "default" | "disabled">("default");
//isRecording ? "destructive" : "default"
  const [isMobile, setIsMobile] = useState(false);

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
    audioStream
  } = useSpeechRecording()

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
    handleDeleteVideo
  }=useVideoRecording()
  
  const{
    hasCameraPermission,
    hasMicrophonePermission,
    checkCameraPermission,
    checkMicrophonePermission,
  } = useMediaPermissions()

  useEffect(() => {
    const updateVisualizerDimensions = () => {
      if (visualizerContainerRef.current) {
        const { width, height } = visualizerContainerRef.current.getBoundingClientRect()
        setVisualizerDimensions({ width, height })
      }
    }

    updateVisualizerDimensions()
    window.addEventListener('resize', updateVisualizerDimensions)

    return () => {
      window.removeEventListener('resize', updateVisualizerDimensions)
    }
  }, [])

  useEffect(() => {
    if (recorderChunks.length > 0) {
      const blob = new Blob(recorderChunks, { type: 'video/webm' })
      const url = URL.createObjectURL(blob)
      setVideoUrl(url)
      setCanRecording("disabled")
    } else {
      setVideoUrl(null)
    }
  }, [recorderChunks])

  const handleStartRecording = useCallback(() => {
    checkCameraPermission();
    checkMicrophonePermission();
    toast.dismiss();
    if (hasCameraPermission && hasMicrophonePermission) {
      startListening(resetTranscript, 'es-MX');
      handleStartCaptureClick();
      setIsRecording(true);
      setCanRecording("destructive");
    }
  }, [hasCameraPermission, hasMicrophonePermission, startListening, resetTranscript, handleStartCaptureClick]);

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
    return <div className="text-center p-4 text-red-500">Su navegador no soporta el reconocimiento de voz.</div>
  }

  

  // Simulated static data from API
  const personName = "Ariel Ramos"
  const imageUrl = "https://i.pravatar.cc/300"
  const idStudent = "20TE0164"
  const idTeacher = "30TE8901"
  const Materia = "SistemasProgramables"

  // Simulated devices
  const devices = [
    { id: "1", name: "Integrated Webcam" },
    { id: "2", name: "External USB Camera" },
    { id: "3", name: "Virtual Camera" },
  ]

  // uploadBytes(storageRef, blob).then((snapshot) => {
  //   console.log('¡Video subido!', snapshot);
  // });
  // Función independiente para subir el Blob a Firebase Storage
  const uploadVideoToFirebase = async (blob: Blob): Promise<string> => {
    // Crea una referencia en Firebase Storage para el archivo
    const storageRef = ref(storage, `videos/${Date.now()}.webm`);

    try {
      // Sube el archivo Blob a Firebase Storage
      const snapshot = await uploadBytes(storageRef, blob);
      console.log("Archivo subido con éxito:", snapshot);

      // Obtén la URL de descarga del archivo
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log("URL de descarga:", downloadURL);

      // Devuelve la URL de descarga
      return downloadURL;
    } catch (error) {
      console.error("Error al subir el archivo:", error);
      throw error; // Lanza el error para que pueda ser manejado en la llamada
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <img src={imageUrl} alt={personName} className="w-16 h-16 rounded-full" />
            <div>
              <h2 className="text-2xl font-bold">{personName}</h2>
              <p className="text-sm text-muted-foreground">Speaker</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
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
              <Button variant="outline" size="icon" aria-label="Cambiar Camara" onClick={toggleFacingMode}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
            {/* <Button variant="outline" size="icon" aria-label="Actualizar dispositivos">
              <RefreshCw className="h-4 w-4" />
            </Button> */}
          </div>
          <Card>
            <CardContent className="p-4">
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
                {videoUrl ? (
                  <video src={videoUrl} controls className="w-full h-full object-cover" />
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
          {/* {isRecording ?
              <Button variant="destructive" onClick={handleStopRecording}>
                <Square className="w-4 h-4 mr-2" /> Detener
              </Button>
              :
              <Button onClick={handleStartRecording}>
                <Mic className="w-4 h-4 mr-2" /> Grabar
              </Button>
            } */}

            <Button 
              onClick={isRecording ? handleStopRecording : handleStartRecording}
              variant={canRecording}
              aria-label={isRecording ? "Detener grabación de audio y video" : "Iniciar grabación de audioy video"}
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
            <Button 
              onClick={stopListening} 
              variant="secondary"
              aria-label="Finalizar grabación"
            >
              <X className="w-4 h-4 mr-2" /> Finalizar
            </Button>
          </div>
        </div>
        <div className="space-y-4">
          <Card className="h-[300px] flex flex-col">
            <CardContent className="p-4 flex-grow overflow-hidden flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold">Transcripción</h3>
                <span className="text-sm text-muted-foreground">{formatTime(recordingTime)}</span>
              </div>
              <div className="flex-grow overflow-y-auto">
                {transcript ? (
                  <p>{transcript}</p>
                ) : (
                  <p className="text-center text-sm text-muted-foreground">Aún no hay transcripción.</p>
                )}
              </div>
            </CardContent>
            <div ref={visualizerContainerRef} className="p-4 border-t h-[120px] flex items-center justify-center">
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
                <p className="text-sm text-muted-foreground">El visualizador de audio aparecerá aquí durante la grabación.</p>
              )}
            </div>
          </Card>
          
        </div>
      </div>
    </div>
  )
}