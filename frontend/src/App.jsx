import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import Navbar from "./components/Navbar"
import PredictionForm from "./components/PredictionForm"
import DataUploadForm from "./components/DataUploadForm"
import DataView from "./components/DataView"

// Componente wrapper para detectar la ruta actual
const AppContent = () => {
  const location = useLocation()

  // Determinar la pestaña activa basada en la ruta
  const getActiveTab = () => {
    const path = location.pathname
    if (path === "/") return "prediccion"
    if (path === "/upload") return "cargar"
    if (path === "/view-data") return "ver"
    return ""
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar activeTab={getActiveTab()} />
      <Routes>
        <Route path="/" element={<PredictionForm />} />
        <Route path="/upload" element={<DataUploadForm />} />
        <Route path="/view-data" element={<DataView />} />
      </Routes>
    </div>
  )
}

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App

