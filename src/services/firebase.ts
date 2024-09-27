// src/services/firebase.js
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {storage, firestore} from '../firebaseConfig'; // Importa la inicialización de Firebase
import { collection, addDoc } from "firebase/firestore"; // Funciones de Firestore
import { MessageData, sendMessageToSQS } from "./sqsService";
import { TextData, sendDataToTextAnalysis } from "./analysisTextService";

export const uploadVideoToFirebase = async (blob:Blob, metadata:any) => {
  const storageRef = ref(storage, `studentVideo/${metadata.customMetadata.idStudent}_${Date.now()}.webm`);

  try {
    const snapshot = await uploadBytes(storageRef, blob, metadata);
    console.log("Archivo subido con éxito:", snapshot);

    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log("URL de descarga:", downloadURL);

    const docRef = await addDoc(collection(firestore, "videos"), {
      idStudent: metadata.customMetadata.idStudent,
      idTeacher: metadata.customMetadata.idTeacher,
      idCourse: metadata.customMetadata.idCourse,
      aspect: metadata.customMetadata.aspect,
      videoURL: downloadURL,
      uploadTime: new Date().toISOString(),
    });
    console.log("Documento añadido con ID: ", docRef.id);

    const messageData: MessageData = {
      idStudent: metadata.customMetadata.idStudent,
      idTeacher: metadata.customMetadata.idTeacher,
      idCourse: metadata.customMetadata.idCourse,
      aspect: metadata.customMetadata.aspect, // Convierte a número si es necesario
      video_url: downloadURL,  // Usamos el URL de descarga del video
    };

    const textData : TextData={
      idStudent: metadata.customMetadata.idStudent,
      idTeacher: metadata.customMetadata.idTeacher,
      idCourse: metadata.customMetadata.idCourse,
      aspect: metadata.customMetadata.aspect, // Convierte a número si es necesario
      comment: metadata.customMetadata.comment,
    }
    
    try {
      await sendMessageToSQS(messageData);
      await sendDataToTextAnalysis(textData);
      console.log('Mensaje enviado con éxito');
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
    }

    return "200";
  } catch (error) {
    console.error("Error al subir el archivo:", error);
    return "400";
  }
};
