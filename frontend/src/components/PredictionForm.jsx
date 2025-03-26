"use client"

import { useState } from "react"
import { getPrediction } from "../services/predictionService"
import { guardarPrediccion } from "../services/predictionStorageService"
import { calcularICA } from "../utils/icaCalculator"
import { CalendarIcon, Save } from "lucide-react"

const PredictionForm = () => {
  const [fecha, setFecha] = useState("")
  const [resultado, setResultado] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [guardado, setGuardado] = useState(false)

  const unidades = {
    color: "UPt-Co",
    turbidez: "NTU",
    ph: "pH",
    dureza: "mg/L",
    conductividad: "µS/cm",
    tds: "mg/L",
    ica: "ICA",
  }

  const formatearNombreParametro = (parametro) => {
    if (parametro === "ph") return "pH"
    if (parametro === "tds") return "TDS"
    if (parametro === "ica") return "ICA"
    return parametro.charAt(0).toUpperCase() + parametro.slice(1)
  }

  const getColorICA = (valor) => {
    if (valor >= 85) return "bg-green-500 text-white"
    if (valor >= 70) return "bg-green-300 text-black"
    if (valor >= 50) return "bg-yellow-300 text-black"
    if (valor >= 30) return "bg-orange-400 text-black"
    return "bg-red-500 text-white"
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!fecha) {
      alert("Por favor selecciona una fecha.")
      return
    }

    setIsLoading(true)
    setGuardado(false)
    try {
      const data = await getPrediction(fecha)
      const ica = calcularICA(data.prediction)
      setResultado({ ...data.prediction, ica })
    } catch (err) {
      alert("Error al obtener la predicción.")
      console.error("Error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGuardar = async () => {
    if (!resultado || !fecha) return

    try {
      await guardarPrediccion(fecha, resultado)
      setGuardado(true)
      alert("✅ Predicción guardada correctamente.")
    } catch (error) {
      alert("❌ Error al guardar la predicción.")
      console.error("Error al guardar:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4c8cb4]/10 via-[#74ab3c]/10 to-[#7eb53c]/10 py-8">
      <div className="container mx-auto px-4">
        <div className="w-full max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">🔍 Predicción de Parámetros del Agua</h2>

            <form onSubmit={handleSubmit} className="space-y-8 max-w-md mx-auto">
              <div className="flex flex-col">
                <label className="text-lg font-medium mb-3 block text-center">
                  <CalendarIcon className="inline-block mr-2 h-5 w-5" />
                  Seleccione una fecha para la predicción
                </label>
                <input
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#74ab3c] focus:border-transparent text-center"
                  required
                />
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="w-full bg-[#74ab3c] hover:bg-[#74ab3c]/90 text-white py-3 px-6 rounded-md font-medium transition-colors disabled:opacity-50 text-lg"
                  disabled={isLoading}
                >
                  {isLoading ? "Procesando..." : "Predecir"}
                </button>
              </div>
            </form>

            {resultado && (
              <div className="mt-10 space-y-8">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-medium">📊 Resultados de la Predicción</h3>
                  <button
                    onClick={handleGuardar}
                    className={`flex items-center gap-2 py-2 px-4 rounded-md font-medium transition-colors ${
                      guardado ? "bg-green-500 text-white" : "bg-[#0464cc] hover:bg-[#0454b4] text-white"
                    }`}
                    disabled={guardado}
                  >
                    {guardado ? (
                      <>✅ Guardado</>
                    ) : (
                      <>
                        <Save className="h-4 w-4" /> Guardar
                      </>
                    )}
                  </button>
                </div>

                <div className="rounded-md border overflow-hidden shadow-sm">
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
                            className={`px-6 py-4 whitespace-nowrap text-sm ${
                              parametro === "ica"
                                ? `${getColorICA(valor)} font-medium px-3 py-1 rounded-full text-center`
                                : "text-gray-500"
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

                {/* Leyenda del ICA */}
                <div className="mt-8 bg-gray-50 p-4 rounded-lg border">
                  <h3 className="text-lg font-medium mb-4">📋 Índice de Calidad del Agua (ICA)</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-green-500 rounded-full"></div>
                      <span>No contaminado (85-100)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-green-300 rounded-full"></div>
                      <span>Aceptable (70-84)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-yellow-300 rounded-full"></div>
                      <span>Poco contaminado (50-69)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-orange-400 rounded-full"></div>
                      <span>Contaminado (30-49)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-red-500 rounded-full"></div>
                      <span>Altamente contaminado (0-29)</span>
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

