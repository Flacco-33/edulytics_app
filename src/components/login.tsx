'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function LoginPage() {
  const [controlNumber, setControlNumber] = useState('')
  const [name, setName] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (controlNumber.trim() && name.trim()) {
      localStorage.setItem('controlNumber', controlNumber)
      localStorage.setItem('name',name)
      router.push('/dashboard') // Asume que redirigimos a una página de dashboard después del login
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Iniciar Sesión</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="controlNumber" className="text-sm font-medium text-gray-700">
                Número de Control
              </label>
              <Input
                id="controlNumber"
                type="text"
                placeholder="Ingresa tu número de control"
                value={controlNumber}
                onChange={(e) => setControlNumber(e.target.value)}
                required
              />
               <label htmlFor="controlNumber" className="my-4 text-sm font-medium text-gray-700">
                Nombre
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Ingresa tu nombre completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Ingresar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}