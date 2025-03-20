import React from "react"
import { Link } from "react-router-dom"

import PropTypes from "prop-types";

const Navbar = ({ activeTab }) => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#4c8cb4] to-[#74ab3c]"></div>
            <h1 className="text-xl font-bold text-gray-800">AquaPredict</h1>
          </div>
          <nav>
            <ul className="flex space-x-1">
              <li>
                <Link
                  to="/"
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "prediccion" ? "bg-[#74ab3c] text-white" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Predicción
                </Link>
              </li>
              <li>
                <Link
                  to="/upload"
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "cargar" ? "bg-[#4c8cb4] text-white" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Cargar Datos
                </Link>
              </li>
              <li>
                <Link
                  to="/view-data"
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "ver" ? "bg-[#7eb53c] text-white" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Ver Datos
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}

// export the Navbar component
export default Navbar

Navbar.propTypes = {
  activeTab: PropTypes.string.isRequired,
};
