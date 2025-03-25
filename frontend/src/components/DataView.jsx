"use client"

import React from "react"
import { useState } from "react"
import { fetchDataByDate } from "../services/dataService"
import { Database, Search } from "lucide-react"

const DataView = () => {
  const [fecha, setFecha] = useState("")
  const [datos, setDatos] = useState([
    {
      fecha: "0/0/0",
      ph: 0,
      turbidez: 0,
      conductividad: 0,
      tds: 0,
      dureza: 0,
      color: 0,
      ica: 0,
    },
  ])
  
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async () => {
    if (!fecha) {
      alert("Por favor ingresa una fecha válida.")
      return
    }

    setIsLoading(true)
    try {
      const data = await fetchDataByDate(fecha)
      if (data.length === 0) {
        alert("No se encontraron datos para la fecha seleccionada.")
      } else {
        setDatos(data)
      }
    } catch (err) {
      alert("Error al obtener los datos.")
      console.error("Error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4c8cb4]/10 via-[#74ab3c]/10 to-[#7eb53c]/10 py-8">
      <div className="container mx-auto px-4">
        <div className="w-full max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">📋 Visualizar Datos</h2>

            <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
              <div className="flex-1">
                <label htmlFor="date-input" className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha
                </label>
                <input
                  id="date-input"
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7eb53c] focus:border-transparent"
                />
              </div>
              <div>
                <button
                  onClick={handleSearch}
                  className="w-full md:w-auto bg-[#7eb53c] hover:bg-[#7eb53c]/90 text-white py-2 px-4 rounded-md font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                  disabled={isLoading}
                >
                  <Search className="h-4 w-4" />
                  {isLoading ? "Buscando..." : "Buscar"}
                </button>
              </div>
            </div>

            {datos.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-2">
                    <Database className="h-5 w-5 text-[#7eb53c]" />
                   {/* <span className="font-medium">Registros encontrados: {datos.length-1}</span>*/}
                    <span className="font-medium">Registros encontrados:</span>
                  </div>
                </div>

                <div className="rounded-md border overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fecha
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          pH
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Turbidez (NTU)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Conductividad (μS/cm)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          TDS (mg/L)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Dureza (mg/L)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Color
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ICA
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {datos.map((dato, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dato.fecha}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dato.ph}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dato.turbidez}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dato.conductividad}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dato.tds}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dato.dureza}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dato.color}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dato.ica}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DataView

