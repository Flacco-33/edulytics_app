'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Analysis from '@/components/analisis';

// Tipo para los datos del docente
type TeacherData = {
  id: string;
  name: string;
  subject: string;
  imageUrl: string;
}

// Función simulada para obtener datos del docente
const fetchTeacherData = async (id: string): Promise<TeacherData> => {
  // Simula una llamada a API
  return {
    id,
    name: "Magali Elizabeth Pedraza Lopez",
    subject: "Impuestos",
    imageUrl: "https://i.pravatar.cc/300"
  }
}

export default function AnalysisPage() {
  const params = useParams()
  const [teacherData, setTeacherData] = useState<TeacherData | null>(null)
    useEffect(()=>{
        if(params?.id===null){
            window.location.href = '/'
        }
    },[])
  useEffect(() => {
    const loadTeacherData = async () => {
      if (params?.id) {
        const data = await fetchTeacherData(params.id as string)
        setTeacherData(data)
      }
    }
    loadTeacherData()
  }, [params?.id])

  if (!teacherData) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold">Análisis de Desempeño Docente</h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <Analysis teacher={teacherData} 
        />
      </main>
      <footer className="bg-muted py-4 mt-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2023 Sistema de Evaluación Docente. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  )
}