"use client"
import { useState } from "react"
import { uploadFile } from "../services/uploadService"
import { Upload, FileText, X } from "lucide-react"

const DataUploadForm = () => {
  const [archivo, setArchivo] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!archivo) {
      alert("Por favor selecciona un archivo.")
      return
    }
    uploadFile(archivo, setIsLoading)
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setArchivo(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setArchivo(e.target.files[0])
    }
  }

  const removeFile = () => {
    setArchivo(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4c8cb4]/10 via-[#74ab3c]/10 to-[#7eb53c]/10 py-4 sm:py-8">
      <div className="container mx-auto px-4">
        <div className="w-full max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 text-center">
              📂 Cargar Datos a la Base de Datos
            </h2>

            <form
              onSubmit={handleSubmit}
              className="space-y-4 sm:space-y-6"
              encType="multipart/form-data"
              onDragEnter={handleDrag}
            >
              <div className="space-y-2 sm:space-y-4">
                <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-1">
                  Archivo de Datos
                </label>
                <div
                  className="flex items-center justify-center w-full"
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <label
                    htmlFor="file-upload"
                    className={`flex flex-col items-center justify-center w-full h-28 sm:h-32 border-2 border-dashed rounded-lg cursor-pointer 
                    ${dragActive ? "border-[#4c8cb4] bg-[#4c8cb4]/5" : "border-gray-300 bg-gray-50 hover:bg-gray-100"}`}
                  >
                    <div className="flex flex-col items-center justify-center px-2 py-3 sm:pt-5 sm:pb-6 text-center">
                      <Upload className="w-6 h-6 sm:w-8 sm:h-8 mb-2 text-[#4c8cb4]" />
                      <p className="mb-1 sm:mb-2 text-xs sm:text-sm text-gray-500">
                        <span className="font-semibold">📎 Haga clic para cargar</span>
                        <span className="hidden sm:inline"> o arrastre y suelte</span>
                      </p>
                      <p className="text-xs text-gray-500">CSV (MAX. 10MB)</p>
                    </div>
                    <input id="file-upload" type="file" accept=".csv" className="hidden" onChange={handleFileChange} />
                  </label>
                </div>

                {archivo && (
                  <div className="flex items-center justify-between bg-gray-50 p-2 sm:p-3 rounded-md mt-2">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-[#4c8cb4]" />
                      <div className="text-xs sm:text-sm text-gray-700 truncate max-w-[200px] sm:max-w-md">
                        <span className="font-medium">{archivo.name}</span>
                        <span className="text-gray-500 ml-1 hidden sm:inline">
                          ({(archivo.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex justify-center pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#4c8cb4] hover:bg-[#4c8cb4]/90 text-white py-3 px-4 rounded-md font-medium transition-colors disabled:opacity-50 text-sm sm:text-base"
                  disabled={!archivo || isLoading}
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
                      Subiendo...
                    </span>
                  ) : (
                    "📤 Subir Datos"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DataUploadForm

