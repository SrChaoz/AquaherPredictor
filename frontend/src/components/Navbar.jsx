"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Menu, X } from "lucide-react"
import LogoAquaher from "../assets/icons/IconAquaher.png" // Importar el logo de AquaHer

import PropTypes from "prop-types"

const Navbar = ({ activeTab }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  // Función para manejar la navegación
  const handleNavigation = (path) => {
    closeMenu()
    navigate(path)
  }

  const navItems = [
    { to: "/", label: "Predicción", value: "prediccion", color: "bg-[#74ab3c]" },
    { to: "/upload", label: "Cargar Datos", value: "cargar", color: "bg-[#4c8cb4]" },
    { to: "/view-data", label: "Datos Reales", value: "ver", color: "bg-[#7eb53c]" },
    { to: "/all-data", label: "Historial Predicciones", value: "historial", color: "bg-[#0464cc]" },
  ]

  return (
    <header className="bg-white shadow-md relative z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo y título - visible en todas las pantallas */}
          <div className="flex items-center space-x-2">
            <img src={LogoAquaher || "/placeholder.svg"} alt="Logo AquaHer" className="h-8 w-8" />
            <h1 className="text-xl font-bold">
              <span className="text-[#0454b4]">AquaHer</span>
              <span className="text-[#74ab3c]">Predict</span>
            </h1>
          </div>

          {/* Navegación para pantallas medianas y grandes */}
          <nav className="hidden md:block">
            <ul className="flex space-x-1">
              {navItems.map((item) => (
                <li key={item.value}>
                  <Link
                    to={item.to}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === item.value ? `${item.color} text-white` : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Botón de menú hamburguesa - solo visible en pantallas pequeñas */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Menú móvil desplegable */}
      <div
        className={`md:hidden absolute w-full bg-white shadow-md transition-all duration-300 ease-in-out z-50 ${
          isMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <nav className="container mx-auto px-4 py-2">
          <ul className="space-y-2 pb-3">
            {navItems.map((item) => (
              <li key={item.value}>
                <button
                  onClick={() => handleNavigation(item.to)}
                  className={`w-full text-left block px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                    activeTab === item.value ? `${item.color} text-white` : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Overlay para cerrar el menú al hacer clic fuera */}
      {isMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-25 z-40"
          onClick={closeMenu}
          aria-hidden="true"
        ></div>
      )}
    </header>
  )
}

export default Navbar

Navbar.propTypes = {
  activeTab: PropTypes.string.isRequired,
}

