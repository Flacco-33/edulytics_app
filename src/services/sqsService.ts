
export interface MessageData {
    idCourse: string;
    idTeacher: string;
    idStudent: string;
    aspect: 1 | 2 | 3 | 4; 
    video_url: string;
  }
  
  export const sendMessageToSQS = async (message: MessageData): Promise<void> => {
    try {
      const response = await fetch('/api/sendMessageQueue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });
  
      if (!response.ok) {
        throw new Error('Failed to send message'); 
      }
  
      const result = await response.json();
      console.log('Message sent successfully:', result);
    } catch (error) {
      console.error('Error sending message:', error);
      throw error; 
    }
  };
  