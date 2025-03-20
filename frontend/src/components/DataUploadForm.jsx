"use client"

import React from "react";
import { useState } from "react";
import { uploadFile } from "../services/uploadService";
import { Upload } from "lucide-react";

const DataUploadForm = () => {
  const [archivo, setArchivo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!archivo) {
      alert("Por favor selecciona un archivo.");
      return;
    }
    uploadFile(archivo, setIsLoading);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4c8cb4]/10 via-[#74ab3c]/10 to-[#7eb53c]/10 py-8">
      <div className="container mx-auto px-4">
        <div className="w-full max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">📂 Cargar Datos a la Base de Datos</h2>

            <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
              <div className="space-y-4">
                <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-1">
                  Archivo de Datos
                </label>
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-[#4c8cb4]" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">📎 Haga clic para cargar</span> o arrastre y suelte
                      </p>
                      <p className="text-xs text-gray-500">CSV (MAX. 10MB)</p>
                    </div>
                    <input
                      id="file-upload"
                      type="file"
                      accept=".csv"
                      className="hidden"
                      onChange={(e) => e.target.files && setArchivo(e.target.files[0])}
                    />
                  </label>
                </div>
                {archivo && (
                  <div className="text-sm text-gray-500 mt-2">
                    Archivo seleccionado: <span className="font-medium">{archivo.name}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="w-full bg-[#4c8cb4] hover:bg-[#4c8cb4]/90 text-white py-2 px-4 rounded-md font-medium transition-colors disabled:opacity-50"
                  disabled={!archivo || isLoading}
                >
                  {isLoading ? "Subiendo..." : "📤 Subir Datos"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
};

export default DataUploadForm;
