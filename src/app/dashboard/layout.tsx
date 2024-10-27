'use client'; // Asegúrate de incluir esta línea

import { useState } from "react";
import Sidebar from "@/components/sidebar";
import { AuthProvider } from "@/context/AuthContext";


export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const name = localStorage.getItem('name');
  const controlNumber = localStorage.getItem('controlNumber');
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <AuthProvider>
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      {/* Botón para abrir/cerrar el Sidebar en pantallas pequeñas */}
      <button
        onClick={toggleSidebar}
        className="md:hidden p-2 bg-primary text-white">
        {isSidebarOpen ? "Cerrar menú" : "Abrir menú"}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white transition-transform md:relative md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:w-64`}>
        <Sidebar
          studentId= {controlNumber??'No number'}
          studentMajor="Ing. Sistemas Computacionales"
          studentImageUrl="https://i.pravatar.cc/300"
          studentName = {name??'No name'}
        />
      </div>

      {/* Contenido principal */}
      <div className="flex-grow p-2 md:p-5">{children}</div>
    </div>
    </AuthProvider>
  );
}
