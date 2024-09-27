import axios from 'axios';

export interface TextData {
  idCourse: string;
  idTeacher: string;
  idStudent: string;
  aspect: 1 | 2 | 3 | 4;
  comment: string;
}

export const sendDataToTextAnalysis = async (textData: TextData): Promise<void> => {
  try {
    const response = await axios.post('https://normally-ready-flea.ngrok-free.app/textAnalysis', textData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Text analysis result:', response.data);
  } catch (error) {
    console.error('Error sending message or analyzing text:', error);
    throw error;
  }
};
