"use client"

import { useState, useEffect } from "react"
import { fetchAllData, fetchDataByDate, fetchDataByRange } from "../services/dataService"
import { Database, Search, Calendar, ChevronLeft, ChevronRight, RefreshCw, CalendarRange } from "lucide-react"

const DataView = () => {
  const [fecha, setFecha] = useState("")
  const [fechaDesde, setFechaDesde] = useState("")
  const [fechaHasta, setFechaHasta] = useState("")
  const [searchMode, setSearchMode] = useState("single") // "single" o "range"
  const [allData, setAllData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchPerformed, setSearchPerformed] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  // Configuración de paginación
  const itemsPerPage = 10
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  // Cargar todos los datos al montar el componente
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchAllData()
        setAllData(data)
        setFilteredData(data)
      } catch (err) {
        console.error("Error al cargar los datos:", err)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Función para colorear el ICA
  const getColorICA = (valor) => {
    if (valor >= 85) return "bg-green-500 text-white"
    if (valor >= 70) return "bg-green-300 text-black"
    if (valor >= 50) return "bg-yellow-300 text-black"
    if (valor >= 30) return "bg-orange-400 text-black"
    return "bg-red-500 text-white"
  }

  // Manejar cambio de página
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  // Cambiar modo de búsqueda
  const toggleSearchMode = (mode) => {
    setSearchMode(mode)
    // Limpiar campos al cambiar de modo
    setFecha("")
    setFechaDesde("")
    setFechaHasta("")
  }

  // Buscar por fecha o rango
  const handleSearch = async () => {
    if (searchMode === "single" && !fecha) {
      alert("Por favor ingresa una fecha válida.")
      return
    }

    if (searchMode === "range" && (!fechaDesde || !fechaHasta)) {
      alert("Por favor ingresa un rango de fechas válido.")
      return
    }

    if (searchMode === "range" && fechaDesde > fechaHasta) {
      alert("La fecha inicial no puede ser posterior a la fecha final.")
      return
    }

    setIsLoading(true)
    setSearchPerformed(true)
    setCurrentPage(1) // Resetear a la primera página al realizar una nueva búsqueda

    try {
      let data = []

      if (searchMode === "single") {
        data = await fetchDataByDate(fecha)
        if (data.length === 0) {
          alert("No se encontraron datos para la fecha seleccionada.")
        } else {
          setFilteredData(data)
        }
      } else {
        data = await fetchDataByRange(fechaDesde, fechaHasta)
        if (data.length === 0) {
          alert("No se encontraron datos para el rango de fechas seleccionado.")
        } else {
          setFilteredData(data)
        }
      }
    } catch (err) {
      alert("Error al obtener los datos.")
      console.error("Error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  // Limpiar búsqueda y mostrar todos los datos
  const handleClearSearch = () => {
    setFecha("")
    setFechaDesde("")
    setFechaHasta("")
    setFilteredData(allData)
    setSearchPerformed(false)
    setCurrentPage(1)
  }

  // Obtener mensaje de resultados
  const getResultsMessage = () => {
    if (isLoading) return "Cargando datos..."
    if (!searchPerformed) return `Total de registros: ${filteredData.length}`

    if (searchMode === "single") {
      return `Resultados para ${fecha}: ${filteredData.length}`
    } else {
      return `Resultados desde ${fechaDesde} hasta ${fechaHasta}: ${filteredData.length}`
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4c8cb4]/10 via-[#74ab3c]/10 to-[#7eb53c]/10 py-8">
      <div className="container mx-auto px-4">
        <div className="w-full max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">📋 Visualizar Datos</h2>

            {/* Selector de modo de búsqueda */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex rounded-md shadow-sm" role="group">
                <button
                  type="button"
                  onClick={() => toggleSearchMode("single")}
                  className={`px-4 py-2 text-sm font-medium rounded-l-lg border ${
                    searchMode === "single"
                      ? "bg-[#7eb53c] text-white border-[#7eb53c]"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  <Calendar className="h-4 w-4 inline-block mr-2" />
                  Fecha Específica
                </button>
                <button
                  type="button"
                  onClick={() => toggleSearchMode("range")}
                  className={`px-4 py-2 text-sm font-medium rounded-r-lg border ${
                    searchMode === "range"
                      ? "bg-[#4c8cb4] text-white border-[#4c8cb4]"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  <CalendarRange className="h-4 w-4 inline-block mr-2" />
                  Rango de Fechas
                </button>
              </div>
            </div>

            {/* Formulario de búsqueda */}
            <div className="flex flex-col md:flex-row md:items-end gap-4 mb-8">
              {searchMode === "single" ? (
                <div className="flex-1">
                  <label
                    htmlFor="date-input"
                    className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
                  >
                    <Calendar className="h-4 w-4 text-[#7eb53c]" />
                    Filtrar por Fecha
                  </label>
                  <input
                    id="date-input"
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7eb53c] focus:border-transparent"
                  />
                </div>
              ) : (
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="date-from"
                      className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
                    >
                      <Calendar className="h-4 w-4 text-[#4c8cb4]" />
                      Desde
                    </label>
                    <input
                      id="date-from"
                      type="date"
                      value={fechaDesde}
                      onChange={(e) => setFechaDesde(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4c8cb4] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="date-to" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="h-4 w-4 text-[#4c8cb4]" />
                      Hasta
                    </label>
                    <input
                      id="date-to"
                      type="date"
                      value={fechaHasta}
                      onChange={(e) => setFechaHasta(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4c8cb4] focus:border-transparent"
                    />
                  </div>
                </div>
              )}
              <div className="flex gap-2">
                <button
                  onClick={handleSearch}
                  className={`${
                    searchMode === "single"
                      ? "bg-[#7eb53c] hover:bg-[#7eb53c]/90"
                      : "bg-[#4c8cb4] hover:bg-[#4c8cb4]/90"
                  } text-white py-3 px-6 rounded-md font-medium transition-colors flex items-center gap-2 disabled:opacity-50`}
                  disabled={isLoading}
                >
                  <Search className="h-5 w-5" />
                  {isLoading ? "Buscando..." : "Buscar"}
                </button>
                {searchPerformed && (
                  <button
                    onClick={handleClearSearch}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-4 rounded-md font-medium transition-colors flex items-center gap-2"
                  >
                    <RefreshCw className="h-5 w-5" />
                    Mostrar Todo
                  </button>
                )}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                  <Database className="h-5 w-5 text-[#7eb53c]" />
                  <span className="font-medium">{getResultsMessage()}</span>
                </div>
              </div>

              {filteredData.length > 0 ? (
                <div className="rounded-md border overflow-x-auto shadow-sm">
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
                      {isLoading ? (
                        <tr>
                          <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                            Cargando datos...
                          </td>
                        </tr>
                      ) : currentItems.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                            No hay datos disponibles
                          </td>
                        </tr>
                      ) : (
                        currentItems.map((dato, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(dato.fecha).toLocaleDateString("es-EC", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              })}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dato.ph != null ? dato.ph.toFixed(2) : 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dato.turbidez ?? 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dato.conductividad ?? 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dato.tds ?? 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dato.dureza ?? 'N/A' }</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dato.color ?? 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span className={`${getColorICA(dato.ica)} px-2 py-1 rounded-full text-xs font-medium`}>
                                {dato.ica != null ? dato.ica.toFixed(2) : 'N/A'}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                !isLoading && (
                  <div className="text-center py-10 text-gray-500">
                    <Database className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg">No hay datos disponibles</p>
                  </div>
                )
              )}

              {/* Paginación */}
              {filteredData.length > itemsPerPage && (
                <div className="flex justify-between items-center mt-4 px-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-3 py-1 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      // Lógica para mostrar 5 páginas centradas alrededor de la página actual
                      let pageNum
                      if (totalPages <= 5) {
                        pageNum = i + 1
                      } else if (currentPage <= 3) {
                        pageNum = i + 1
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i
                      } else {
                        pageNum = currentPage - 2 + i
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium ${
                            currentPage === pageNum ? "bg-[#7eb53c] text-white" : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    })}

                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <>
                        <span className="px-1">...</span>
                        <button
                          onClick={() => handlePageChange(totalPages)}
                          className="w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                        >
                          {totalPages}
                        </button>
                      </>
                    )}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 px-3 py-1 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Siguiente
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}

              {filteredData.length > 0 && (
                <div className="text-sm text-gray-500 text-center mt-2">
                  Mostrando {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredData.length)} de{" "}
                  {filteredData.length} registros
                </div>
              )}

              {/* Leyenda del ICA */}
              {filteredData.length > 0 && (
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
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DataView

