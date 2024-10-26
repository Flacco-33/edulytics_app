'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ClipboardCheck, BarChart2, Lightbulb } from "lucide-react"

type SidebarProps = {
  studentName: string
  studentId: string
  studentMajor: string
  studentImageUrl: string
  // onOptionClick: (option: string) => void
}

export default function Sidebar({
  studentName,
  studentId,
  studentMajor,
  studentImageUrl,
  // onOptionClick
}: SidebarProps) {
  return (
    <Card className="h-screen w-64 flex flex-col">
      <CardContent className="flex-grow flex flex-col p-4">
        <div className="mb-6 text-center">
          <Avatar className="w-24 h-24 mx-auto mb-2">
            <AvatarImage src={studentImageUrl} alt={studentName} />
            <AvatarFallback>{studentName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <h2 className="font-semibold">{studentName}</h2>
          <p className="text-sm text-muted-foreground">{studentId}</p>
          <p className="text-sm text-muted-foreground">{studentMajor}</p>
        </div>
        <ScrollArea className="flex-grow">
          <nav className="space-y-2">
            <button
              // onClick={() => onOptionClick('evaluacionDocente')}
              className="flex items-center space-x-2 w-full p-2 rounded-lg hover:bg-accent"
            >
              <ClipboardCheck className="w-5 h-5" />
              <span>Evaluación Docente</span>
            </button>
            {/* <button
              onClick={() => onOptionClick('graficas')}
              className="flex items-center space-x-2 w-full p-2 rounded-lg hover:bg-accent"
            >
              <BarChart2 className="w-5 h-5" />
              <span>Gráficas</span>
            </button>
            <button
              onClick={() => onOptionClick('recomendaciones')}
              className="flex items-center space-x-2 w-full p-2 rounded-lg hover:bg-accent"
            >
              <Lightbulb className="w-5 h-5" />
              <span>Recomendaciones</span>
            </button> */}
          </nav>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}