import { useState, useRef, useEffect } from "react";
import SpeechRecognition from 'react-speech-recognition';
import { useMicrophonePermission } from '@/hooks/useMicrophonePermission';

export const useSpeechRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  


  // Inicia la escucha y la grabación
  const startListening = async (resetTranscript: () => void, language: string) => {

    setRecordingTime(0);
    resetTranscript();
    SpeechRecognition.startListening({
      continuous: true,
      language,
    });
    setIsRecording(true);

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    setAudioStream(stream);
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start(10);
  };

  // Detiene la escucha y la grabación
  const stopListening = () => {
    SpeechRecognition.abortListening();
    setIsRecording(false);
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    if (audioStream) {
      audioStream.getTracks().forEach(track => track.stop());
      setAudioStream(null);
    }
  };

  // Reinicia la grabación
  const resetRecording = (resetTranscript: () => void) => {
    SpeechRecognition.abortListening();
    setIsRecording(false);
    setRecordingTime(0);
    resetTranscript();
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    if (audioStream) {
      audioStream.getTracks().forEach(track => track.stop());
      setAudioStream(null);
    }
  };

  // Efecto para actualizar el tiempo de grabación
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prevTime => prevTime + 1);
      }, 1000);
    } else if (!isRecording && recordingTime !== 0) {
      clearInterval(interval!);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRecording, recordingTime]);

  return {
    recordingTime,
    setRecordingTime,
    startListening,
    stopListening,
    resetRecording,
    mediaRecorderRef,
    audioStream
  };
};
