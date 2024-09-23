import React, { useEffect } from 'react';
import createPonyfill from 'web-speech-cognitive-services/lib/SpeechServices';
import DictateButton from 'react-dictate-button';

const SpeechDictation = () => {
  const [SpeechGrammarList, SpeechRecognition] = SpeechRecognition();

  useEffect(() => {
    const initializeSpeech = async () => {
      const { SpeechGrammarList, SpeechRecognition } = await createPonyfill({
        credentials: {
          region: 'westus',
          subscriptionKey: 'YOUR_SUBSCRIPTION_KEY',
        },
      });

      // Aquí podrías hacer cualquier configuración adicional
    };

    initializeSpeech();
  }, []);

  return (
    <DictateButton
      onDictate={({ result }) => alert(result.transcript)}
      speechGrammarList={SpeechGrammarList}
      speechRecognition={SpeechRecognition}
    >
      Start dictation
    </DictateButton>
  );
};

export default SpeechDictation;
