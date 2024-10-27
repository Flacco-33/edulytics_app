'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Analysis from '@/components/analisis'
import teacherDataArray from '@/api/teacherData.json' 
import {TeacherData} from '@/app/models/teacherData'


export default function AnalysisPage() {
  const params = useParams()
  const router = useRouter()
  const [teacherData, setTeacherData] = useState<TeacherData | null>(null)

  useEffect(() => {
    if (!params?.id) {
      // Redirige al inicio si no hay ID de docente
      router.push('/')
    } else {
      // Intenta cargar los datos desde localStorage
      const storedData = localStorage.getItem('teacherData')
      let teacher

      if (storedData) {
        // Si hay datos en localStorage, busca el docente allí
        const teacherDataArray = JSON.parse(storedData) as TeacherData[]
        teacher = teacherDataArray.find((t) => t.id === params.id)
      } else {
        // Si no hay datos en localStorage, usa los datos del archivo JSON
        teacher = teacherDataArray.find((t) => t.id === params.id)
      }

      if (teacher) {
        // Verifica si el docente ya fue analizado
        if (teacher.analyzed === 'True') {
          // Redirige al dashboard si ya ha sido analizado
          router.push('/dashboard')
        } else {
          setTeacherData(teacher)
        }
      } else {
        // Si no se encuentra el docente, redirige al inicio
        router.push('/')
      }
    }
  }, [params?.id, router])

  if (!teacherData) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="">
        <Analysis
          id={teacherData.id}
          personName={teacherData.name}
          imageUrl={teacherData.imageUrl}  
          idTeacher={teacherData.id}
          idCourse={teacherData.idCourse}
        />
      </main>
    </div>
  )
}
