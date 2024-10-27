'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "sonner";
import {TeacherData} from '@/app/models/teacherData'


// Tipo para los datos de los docentes
// type Teacher = {
//   id: string;
//   name: string;
//   subject: string;
//   imageUrl: string;
//   idCourse: string;
//   analyzed: string;
// }

// Propiedades del componente
type TeacherDirectoryProps = {
  teachers: TeacherData[];
  onTeacherClick: (teacherId: string) => void;
}

export function TeacherDirectoryComponent({ teachers, onTeacherClick }: TeacherDirectoryProps) {
  const handleTeacherClick = (teacherId: string) => {
    // Encuentra el docente correspondiente
    const teacher = teachers.find(t => t.id === teacherId);
    
    // Si no se encuentra o si está analizado, no hacer nada o mostrar un mensaje
    if (teacher) {
      if (teacher.analyzed === "True") {
        toast.dismiss()
        toast.warning("Ya ralizaste la evaluacion docente de este docente.", { position: 'top-right', richColors: true });
      } else {
        onTeacherClick(teacherId);
        toast.dismiss()
      }
    }
  };

  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Directorio de Docentes</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Foto</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Materia</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teachers.map((teacher) => (
                <TableRow 
                  key={teacher.id} 
                  onClick={() => handleTeacherClick(teacher.id)} // Cambia aquí
                  className="cursor-pointer hover:bg-muted"
                >
                  <TableCell>
                    <Avatar>
                      <AvatarImage src={teacher.imageUrl} alt={teacher.name} />
                      <AvatarFallback>{teacher.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell>{teacher.name}</TableCell>
                  <TableCell>{teacher.subject}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
