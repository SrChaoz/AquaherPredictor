Color = UPt-Co
Turbidez = NTU
pH = pH 
Dureza = mg/L
Conductividad = µS/cm
TDS = mg/L

DEPENDENCES:
FRONTEND
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p

npm install lucide-react
npm install prop-types

solucion de multer no sube archivo:
npm uninstall express-fileupload
npm uninstall multer
npm install multer@1.4.3 //version con problemas de seguridad pero funcional
