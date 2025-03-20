exports.convertirFecha = (fecha) => {
    const date = new Date(fecha);
    const today = new Date();

    const diasTranscurridos = Math.floor((date - today) / (1000 * 60 * 60 * 24));
    return {
        Dias_Transcurridos: diasTranscurridos,
        Mes: date.getMonth() + 1,
        Dia: date.getDate(),
        Dia_semana: date.getDay()
    };
};
