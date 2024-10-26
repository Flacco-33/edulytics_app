'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"


// Propiedades del componente
type TeacherDirectoryProps = {
  teachers: Teacher[];
  onTeacherClick: (teacherId: string) => void;
}

export function TeacherDirectoryComponent({ teachers, onTeacherClick }: TeacherDirectoryProps) {
  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Directorio de Docentes</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead >Foto</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Materia</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teachers.map((teacher) => (
                <TableRow 
                  key={teacher.id} 
                  onClick={() => onTeacherClick(teacher.id)}
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