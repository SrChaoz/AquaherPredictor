import axios from 'axios';

export const uploadFile = async (archivo, setIsLoading) => {
    const formData = new FormData();
    formData.append('file', archivo);

    console.log(' Enviando archivo:', archivo);

    setIsLoading(true);

    try {
        const response = await axios.post('http://localhost:3000/api/upload', formData);
        alert(response.data.message);
    } catch (error) {
        alert("Error al subir el archivo.");
        console.error(" Error al subir el archivo:", error);
    } finally {
        setIsLoading(false);
    }
};
