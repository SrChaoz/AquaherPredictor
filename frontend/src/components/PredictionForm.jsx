"use client"

import React from "react"
import { useState } from "react"
import { getPrediction } from "../services/predictionService"
import { calcularICA } from "../utils/icaCalculator"

const PredictionForm = () => {
  const [fecha, setFecha] = useState("")
  const [resultado, setResultado] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const unidades = {
    color: "UPt-Co",
    turbidez: "NTU",
    ph: "pH",
    dureza: "mg/L",
    conductividad: "µS/cm",
    tds: "mg/L",
    ica: "ICA"  // No tiene unidad
  }

  const formatearNombreParametro = (parametro) => {
    if (parametro === "ph") return "pH"
    if (parametro === "tds") return "TDS"
    if (parametro === "ica") return "ICA"
    return parametro.charAt(0).toUpperCase() + parametro.slice(1)
  }

  // Función para obtener el color según el valor del ICA
  const getColorICA = (valor) => {
    if (valor >= 85) return "bg-green-500 text-white"  // No contaminado
    if (valor >= 70) return "bg-green-300 text-black"  // Aceptable
    if (valor >= 50) return "bg-yellow-300 text-black" // Poco contaminado
    if (valor >= 30) return "bg-orange-400 text-black" // Contaminado
    return "bg-red-500 text-white"                     // Altamente contaminado
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!fecha) {
      alert("Por favor selecciona una fecha.")
      return
    }

    setIsLoading(true)
    try {
      const data = await getPrediction(fecha)

      // Calcular el ICA utilizando la función definida
      const ica = calcularICA(data.prediction)
      setResultado({ ...data.prediction, ica })  // Agrega el valor de ICA a los resultados
    } catch (err) {
      alert("Error al obtener la predicción.")
      console.error("Error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4c8cb4]/10 via-[#74ab3c]/10 to-[#7eb53c]/10 py-8">
      <div className="container mx-auto px-4">
        <div className="w-full max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">🔍 Predicción de Parámetros del Agua</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col items-center">
                <label className="text-lg font-medium mb-2 block text-center">
                  📅 Seleccione una fecha para la predicción
                </label>
                <input
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#74ab3c] focus:border-transparent"
                  required
                />
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="w-full max-w-md bg-[#74ab3c] hover:bg-[#74ab3c]/90 text-white py-2 px-4 rounded-md font-medium transition-colors disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? "Procesando..." : "Predecir "}
                </button>
              </div>
            </form>

            {resultado && (
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-3">📊 Resultados de la Predicción</h3>
                <div className="rounded-md border overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Parámetro
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Valor
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Unidad
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {Object.entries(resultado).map(([parametro, valor]) => (
                        <tr key={parametro} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {formatearNombreParametro(parametro)}
                          </td>
                          <td
                            className={`px-6 py-4 whitespace-nowrap text-sm ${parametro === "ica" ? getColorICA(valor) : "text-gray-500"
                              }`}
                          >
                            {valor}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {unidades[parametro] || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* 🔹 Leyenda del ICA */}
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-3">📋 Parametros del ICA (Indice de Calidad del Agua)</h3>
                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-500 rounded-full"></div> No contaminado (85-100)
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-300 rounded-full"></div> Aceptable (70-84)
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-yellow-300 rounded-full"></div> Poco contaminado (50-69)
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-orange-400 rounded-full"></div> Contaminado (30-49)
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-500 rounded-full"></div> Altamente contaminado (0-29)
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PredictionForm
