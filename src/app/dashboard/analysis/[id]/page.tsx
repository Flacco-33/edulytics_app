'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Analysis from '@/components/analisis'

// Tipo para los datos del docente
type TeacherData = {
  id: string;
  name: string;
  subject: string;
  imageUrl: string;
}

// Arreglo de datos de los docentes
const teacherDataArray: TeacherData[] = [
  { id: '1', name: 'María González', subject: 'Matemáticas', imageUrl: 'https://i.pravatar.cc/150?img=1' },
  { id: '2', name: 'Juan Pérez', subject: 'Historia', imageUrl: 'https://i.pravatar.cc/150?img=2' },
  { id: '3', name: 'Ana Rodríguez', subject: 'Biología', imageUrl: 'https://i.pravatar.cc/150?img=3' },
  { id: '4', name: 'Carlos Sánchez', subject: 'Física', imageUrl: 'https://i.pravatar.cc/150?img=4' },
  { id: '5', name: 'Laura Martínez', subject: 'Literatura', imageUrl: 'https://i.pravatar.cc/150?img=5' },
  { id: '6', name: 'Pedro Ramírez', subject: 'Química', imageUrl: 'https://i.pravatar.cc/150?img=6' },
]

export default function AnalysisPage() {
  const params = useParams()
  const [teacherData, setTeacherData] = useState<TeacherData | null>(null)

  useEffect(() => {
    if (!params?.id) {
      window.location.href = '/'
    } else {
      // Encuentra el docente según el id de la URL
      const teacher = teacherDataArray.find(teacher => teacher.id === params.id)
      setTeacherData(teacher || null)
    }
  }, [params?.id])

  if (!teacherData) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="">
        <Analysis
          personName={teacherData.name}
          imageUrl={teacherData.imageUrl}
          idStudent="12345"       // Agrega aquí los valores que necesites
          idTeacher={teacherData.id}
          idCourse="67890"        // También puedes agregar valores de ejemplo o provenientes de otro estado o props
        />
      </main>
    </div>
  )
}
