// 'use client';
// import createSpeechServicesPonyfill from 'web-speech-cognitive-services'

// import React from 'react';
// import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';


// if (typeof document !== 'undefined') {
//   console.log("HOLAAAAAAAAAAAAAA")
// }else{
//   console.log("no documen")
// }

// const Dictaphone = () => {

//   const SUBSCRIPTION_KEY = process.env.NEXT_PUBLIC_AZURE_KEY
// const REGION = 'eastus'
// const { SpeechRecognition: AzureSpeechRecognition } = createSpeechServicesPonyfill({
//   credentials: {
//     region: REGION,
//     subscriptionKey: SUBSCRIPTION_KEY,
//   }
// })
// SpeechRecognition.applyPolyfill(AzureSpeechRecognition)

//   const {
//     transcript,
//     listening,
//     resetTranscript,
//     browserSupportsSpeechRecognition
//   } = useSpeechRecognition();

//   if (!browserSupportsSpeechRecognition) {
//     return <span>Browser doesn't support speech recognition.</span>;
//   }

//   return (
//     <div>
//       <p>Microphone: {listening ? 'on' : 'off'}</p>
//       <button onClick={SpeechRecognition.startListening}>Start</button>
//       <button onClick={SpeechRecognition.stopListening}>Stop</button>
//       <button onClick={resetTranscript}>Reset</button>
//       <p>{transcript}</p>
//     </div>
//   );
// };

// export default Dictaphone;