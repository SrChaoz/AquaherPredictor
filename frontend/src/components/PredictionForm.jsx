"use client"

import { useState } from "react"
import { getPrediction } from "../services/predictionService"
import { guardarPrediccion } from "../services/predictionStorageService"
import { calcularICA } from "../utils/icaCalculator"
import { CalendarIcon, Save, Info, ChevronRight } from "lucide-react"

const PredictionForm = () => {
  const [fecha, setFecha] = useState("")
  const [resultado, setResultado] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [guardado, setGuardado] = useState(false)
  const [showIcaLegend, setShowIcaLegend] = useState(false)
  const [expandedParams, setExpandedParams] = useState([])

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
    setExpandedParams([]) // Resetear parámetros expandidos
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

  const toggleParamExpand = (parametro) => {
    if (expandedParams.includes(parametro)) {
      setExpandedParams(expandedParams.filter((p) => p !== parametro))
    } else {
      setExpandedParams([...expandedParams, parametro])
    }
  }

  const formatValue = (valor) => {
    if (typeof valor === "number") {
      return valor.toFixed(2)
    }
    return valor
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4c8cb4]/10 via-[#74ab3c]/10 to-[#7eb53c]/10 py-4 sm:py-8">
      <div className="container mx-auto px-4">
        <div className="w-full max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 text-center">
              🔍 Predicción de Parámetros del Agua
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 max-w-md mx-auto">
              <div className="flex flex-col">
                <label className="text-base sm:text-lg font-medium mb-2 sm:mb-3 block text-center">
                  <CalendarIcon className="inline-block mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Seleccione una fecha para la predicción
                </label>
                <input
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#74ab3c] focus:border-transparent text-center text-sm sm:text-base"
                  required
                />
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="w-full bg-[#74ab3c] hover:bg-[#74ab3c]/90 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-md font-medium transition-colors disabled:opacity-50 text-sm sm:text-base"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Procesando...
                    </span>
                  ) : (
                    "Predecir"
                  )}
                </button>
              </div>
            </form>

            {resultado && (
              <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                  <h3 className="text-lg sm:text-xl font-medium">📊 Resultados de la Predicción</h3>
                  <button
                    onClick={handleGuardar}
                    className={`flex items-center justify-center gap-1 sm:gap-2 py-2 px-3 sm:px-4 rounded-md font-medium transition-colors text-sm sm:text-base ${
                      guardado ? "bg-green-500 text-white" : "bg-[#0464cc] hover:bg-[#0454b4] text-white"
                    }`}
                    disabled={guardado}
                  >
                    {guardado ? (
                      <>✅ Guardado</>
                    ) : (
                      <>
                        <Save className="h-3 w-3 sm:h-4 sm:w-4" /> Guardar
                      </>
                    )}
                  </button>
                </div>

                {/* Botón para mostrar/ocultar leyenda ICA */}
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowIcaLegend(!showIcaLegend)}
                    className="text-xs sm:text-sm text-gray-600 flex items-center gap-1 hover:text-gray-900"
                  >
                    <Info className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden xs:inline">Leyenda ICA</span>
                    <span className="xs:hidden">ICA</span>
                  </button>
                </div>

                {/* Leyenda del ICA (colapsable) */}
                {showIcaLegend && (
                  <div className="bg-gray-50 p-3 rounded-lg border text-xs sm:text-sm">
                    <h3 className="text-sm sm:text-base font-medium mb-2">📋 Índice de Calidad del Agua (ICA)</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full"></div>
                        <span>No contaminado (85-100)</span>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-300 rounded-full"></div>
                        <span>Aceptable (70-84)</span>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <div className="w-3 h-3 sm:w-4 sm:h-4 bg-yellow-300 rounded-full"></div>
                        <span>Poco contaminado (50-69)</span>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <div className="w-3 h-3 sm:w-4 sm:h-4 bg-orange-400 rounded-full"></div>
                        <span>Contaminado (30-49)</span>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full"></div>
                        <span>Altamente contaminado (0-29)</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tabla para pantallas medianas y grandes */}
                <div className="hidden md:block rounded-md border overflow-hidden shadow-sm">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Parámetro
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Valor
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Unidad
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {Object.entries(resultado).map(([parametro, valor]) => (
                        <tr key={parametro} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                            {formatearNombreParametro(parametro)}
                          </td>
                          <td
                            className={`px-4 py-3 whitespace-nowrap text-sm ${
                              parametro === "ica"
                                ? `${getColorICA(valor)} font-medium px-3 py-1 rounded-full text-center`
                                : "text-gray-500"
                            }`}
                          >
                            {formatValue(valor)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {unidades[parametro] || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Vista de tarjetas para móviles */}
                <div className="md:hidden space-y-3">
                  {Object.entries(resultado).map(([parametro, valor]) => (
                    <div key={parametro} className="bg-white border rounded-lg shadow-sm overflow-hidden">
                      <div
                        className={`flex justify-between items-center p-3 ${
                          parametro === "ica" ? getColorICA(valor) : "bg-gray-50"
                        } cursor-pointer`}
                        onClick={() => toggleParamExpand(parametro)}
                      >
                        <div className="flex items-center space-x-2">
                          <span className={`font-medium text-sm ${parametro === "ica" ? "" : "text-gray-700"}`}>
                            {formatearNombreParametro(parametro)}
                          </span>
                          {parametro === "ica" && <span className="text-xs font-medium">(Índice de Calidad)</span>}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm ${parametro === "ica" ? "font-bold" : "font-medium"}`}>
                            {formatValue(valor)}
                          </span>
                          <ChevronRight
                            className={`h-4 w-4 transition-transform ${
                              expandedParams.includes(parametro) ? "rotate-90" : ""
                            } ${parametro === "ica" ? "text-current" : "text-gray-500"}`}
                          />
                        </div>
                      </div>

                      {expandedParams.includes(parametro) && (
                        <div className="p-3 text-xs border-t">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-500">Unidad de medida:</span>
                            <span className="font-medium">{unidades[parametro] || "-"}</span>
                          </div>
                          {parametro === "ica" && (
                            <div className="mt-2 pt-2 border-t border-gray-100">
                              <p className="text-xs text-gray-500 mb-1">Interpretación:</p>
                              <p className="text-xs font-medium">
                                {valor >= 85
                                  ? "No contaminado (85-100)"
                                  : valor >= 70
                                    ? "Aceptable (70-84)"
                                    : valor >= 50
                                      ? "Poco contaminado (50-69)"
                                      : valor >= 30
                                        ? "Contaminado (30-49)"
                                        : "Altamente contaminado (0-29)"}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
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

