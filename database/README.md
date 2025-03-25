# Restauración de la Base de Datos en pgAdmin

## **Contenido de la Carpeta `backups/`**
- **`RespaldoCanalMesiasDB.backup`**: Archivo de respaldo de la base de datos principal. Contiene la estructura y los datos de la base de datos principal utilizada en el sistema.
- **`RespaldoCanalMesiasDBClima.backup`**: Archivo de respaldo de la base de datos enriquecida con datos climáticos. Esta base de datos incluye información adicional proveniente de fuentes meteorológicas para mejorar el análisis de los parámetros de calidad del agua.

## **Contenido de la Carpeta `scripts/`**
- Archivos SQL que contienen:
  - La creación de tablas.
  - Definición de funciones para automatizar cálculos y procesos.
  - Procedimientos almacenados para gestionar la base de datos.

## **Restaurar la Base de Datos en pgAdmin**
Sigue estos pasos para restaurar la base de datos usando pgAdmin:

### **Paso 1: Abrir pgAdmin**
- Abre pgAdmin e inicia sesión.

### **Paso 2: Crear la Base de Datos (si no existe)**
1. En el panel izquierdo de pgAdmin, haz clic derecho sobre el nodo de tu servidor (ejemplo: *PostgreSQL 14*) y selecciona **Create > Database**.
2. En la ventana emergente:
   - En el campo **Name**, escribe `CanalMesiasDB` o el nombre que desees.
   - Haz clic en **Save**.

### **Paso 3: Restaurar la Base de Datos**
- Antes de restaurar la base de datos tener en cuenta que la base de datos enriquecida no se esta usando, todo trabaja en base a CanalMesiasDB, se adjunta la base de datos enriquecidad para escalar el modelo en un futuro
1. Haz clic derecho sobre la base de datos que acabas de crear (`CanalMesiasDB`).
2. Selecciona **Restore**.
3. En la ventana emergente:
   - En el campo **Filename**, haz clic en el icono de carpeta y selecciona el archivo correspondiente:
     - Para la base de datos principal: `RespaldoCanalMesiasDB.backup`
     - Para la base de datos enriquecida con datos climáticos: `RespaldoCanalMesiasDBClima.backup`
   - En el campo **Format**, selecciona `Custom`.
   - En la sección **Options**, selecciona:
     - **Clean before restore** para eliminar objetos existentes si los hay y restaurar desde cero.

4. Haz clic en **Restore** y espera a que finalice el proceso.

### **Paso 4: Verificar la Base de Datos**
- Una vez restaurada, puedes expandir la base de datos en el panel izquierdo para verificar que todas las tablas, funciones y datos estén presentes.

### **Paso 5: Importar Scripts Manualmente solo si es necesario**
1. Abre la base de datos en pgAdmin.
2. Haz clic en el botón de **Query Tool**.
3. Abre los archivos SQL desde la carpeta `scripts/` y ejecútelos según el orden especificado en los comentarios dentro de los scripts.

---

