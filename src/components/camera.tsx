// 'use client';
// import 'regenerator-runtime/runtime';
// import React, { useState, useRef, useCallback } from 'react';
// import WebCam from 'react-webcam';

// import { Button } from './ui/button';
// import { Card, CardContent } from './ui/card';

// export default function Camera() {
//   const [imgSrc, setImgSrc] = useState(null);
//   const webcamRef = useRef(null);
//   const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
//   const [capturing, setCapturing] = useState(false);
//   const mediaRecorder = useRef(null);
//   const [recorderChunks, setRecorderChunks] = useState([]);

//   const capture = useCallback(() => {
//     const imageSrc = webcamRef.current?.getScreenshot();
//     setImgSrc(imageSrc);
//   }, []);

//   const toggleFacingMode = useCallback(() => {
//     setFacingMode((prevMode) => (prevMode === 'user' ? 'environment' : 'user'));
//   }, []);

//   const handleDataAvailable = useCallback(
//     (event:any) => {
//       if (event.data.size > 0) {
//         setRecorderChunks((prevChunks) => [...prevChunks, event.data]);
//       }
//     },
//     []
//   );

//   const handleStartCaptureClick = useCallback(() => {
//     setRecorderChunks([]);
//     if (webcamRef.current?.stream) {
//       setCapturing(true);
//       mediaRecorder.current = new MediaRecorder(webcamRef.current.stream, {
//         mimeType: 'video/webm',
//       });
//       mediaRecorder.current.addEventListener('dataavailable', handleDataAvailable);
//       mediaRecorder.current.start();
//     }
//   }, [handleDataAvailable]);

//   const handleStopCaptureClick = useCallback(() => {
//     mediaRecorder.current?.stop();
//     setCapturing(false);
//   }, []);

//   return (
//     <div className="flex h-screen flex-col md:flex-row p-10 md:p-0 gap-y-5 items-center justify-center w-full">
//       <div>
//         <WebCam
//           audio={false}
//           height={400}
//           width={600}
//           screenshotFormat="image/jpeg"
//           mirrored={false}
//           ref={webcamRef}
//           videoConstraints={{
//             height: 400,
//             width: 600,
//             facingMode: facingMode,
//           }}
//         />
//         <Button onClick={capture}>Tomar foto</Button>
//         <Button onClick={capturing ? handleStopCaptureClick : handleStartCaptureClick}>
//           {capturing ? 'Detener' : 'Iniciar'}
//         </Button>
//         <Button onClick={toggleFacingMode}>Cambiar cámara</Button>
//         {recorderChunks.length>0&&(
//           <Button onClick={()=>{setRecorderChunks([])}}>Borrar video</Button>
//         )}

//         <div className="mt-4">
//           {imgSrc && (
//             <img
//               src={imgSrc}
//               className="w-1/2 h-1/2 object-cover rounded-lg shadow-lg"
//               alt="Captured"
//             />
//           )}
//           {recorderChunks.length > 0 && (
//             <video controls className="w-1/2 h-1/2 object-cover rounded-lg shadow-lg">
//               <source src={URL.createObjectURL(new Blob(recorderChunks, { type: 'video/webm' }))} />
//             </video>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
