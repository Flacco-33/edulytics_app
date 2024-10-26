'use client'

import 'regenerator-runtime/runtime'
import React from 'react'
import { useRouter } from 'next/navigation'
import { TeacherDirectoryComponent } from '@/components/teacherDirectory'
import Link from 'next/link'

const DashboardPage = () => {
  // Datos estáticos para la tabla
  const teacherData = [
    { id: '1', name: 'María González', subject: 'Matemáticas', imageUrl: 'https://i.pravatar.cc/150?img=1' },
    { id: '2', name: 'Juan Pérez', subject: 'Historia', imageUrl: 'https://i.pravatar.cc/150?img=2' },
    { id: '3', name: 'Ana Rodríguez', subject: 'Biología', imageUrl: 'https://i.pravatar.cc/150?img=3' },
    { id: '4', name: 'Carlos Sánchez', subject: 'Física', imageUrl: 'https://i.pravatar.cc/150?img=4' },
    { id: '5', name: 'Laura Martínez', subject: 'Literatura', imageUrl: 'https://i.pravatar.cc/150?img=5' },
    { id: '6', name: 'Pedro Ramírez', subject: 'Química', imageUrl: 'https://i.pravatar.cc/150?img=6' },
  ]
  const router = useRouter()

  const handleTeacherClick = (teacherId: string) => {
    router.push(`/dashboard/analysis/${teacherId}`)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto px-2 py-1">
        <TeacherDirectoryComponent teachers={teacherData} onTeacherClick={handleTeacherClick}/>
      </main>
     
    </div>
  )
}

export default DashboardPage
