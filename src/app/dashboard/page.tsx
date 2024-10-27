'use client'

import 'regenerator-runtime/runtime'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { TeacherDirectoryComponent } from '@/components/teacherDirectory'
import teacherDataArray from '@/api/teacherData.json'  // Importa los datos desde el archivo JSON
import {TeacherData} from '@/app/models/teacherData'


const DashboardPage = () => {
  const router = useRouter()
  const [teacherData, setTeacherData] = useState<TeacherData[]>([])  // Definimos el tipo de estado

  useEffect(() => {
    // Intenta cargar los datos desde localStorage
    const storedData = localStorage.getItem('teacherData');
    
    if (storedData) {
      // Si hay datos en localStorage, cargarlos
      setTeacherData(JSON.parse(storedData) as TeacherData[]);
    } else {
      // Si no hay datos, cargar los datos desde el JSON y guardarlos en localStorage
      setTeacherData(teacherDataArray as TeacherData[]);
      localStorage.setItem('teacherData', JSON.stringify(teacherDataArray));
    }
  }, [])

  const handleTeacherClick = (teacherId: string) => {
    router.push(`/dashboard/analysis/${teacherId}`)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto px-2 py-1">
        <TeacherDirectoryComponent teachers={teacherData} onTeacherClick={handleTeacherClick} />
      </main>
    </div>
  )
}

export default DashboardPage
