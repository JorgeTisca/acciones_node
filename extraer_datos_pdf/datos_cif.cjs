const fs = require("fs");
const pdf = require("pdf-parse");
const rutaPDF = "./SAT.pdf";

const extraerDatosCIF = async (ruta) => {
  try {
    const dataBuffer = fs.readFileSync(ruta);
    const data = await pdf(dataBuffer);
    let texto = data.text.toUpperCase();
    texto = texto.replace(/ /g, ' ').trim();
    console.log(data.info)
    // console.log(texto)
    const regexes = {
      rfc: /RFC:\s*([A-Z0-9]+)/i,
      curp: /CURP:\s*(.+)/i,
      nombre: /NOMBRE\s*\(S\):\s*(.+)/i,
      apellidoP: /PRIMER\s*APELLIDO:\s*(.+)/i,
      apellidoS: /SEGUNDO\s*APELLIDO:\s*(.+)/i,
      fOperaciones: /FECHA\s*INICIO\s*DE\s*OPERACIONES:\s*(.+)/i,
      estatus: /ESTATUS\s*EN\s*EL PADRÓN:\s*(.+)/i,
      fCAmbioEstado: /FECHA\s*DE\s*ÚLTIMO\s*CAMBIO\s*DE\s*ESTADO:\s*(.+)/i,
      nomComercial: /NOMBRE\s*COMERCIAL:\s*(.+)/i,

      // Domicilio
      cp: /CÓDIGO\s*POSTAL:\s*(\d{5})/i,
      vialidad: /NOMBRE\s*DE\s*VIALIDAD:\s*(.+)/i,
      numInt: /NÚMERO\s*INTERIOR:\s*(.+)/i,
      localidad: /NOMBRE\s*DE\s*LA\s*LOCALIDAD:\s*(.+)/i,
      entidadFederativa: /NOMBRE\s*DE\s*LA\s*ENTIDAD\s*FEDERATIVA:\s*(.+)/i,
      numExterior: /NÚMERO\s*EXTERIOR:\s*(.+)/i,
      colonia: /NOMBRE\s*DE\s*LA\s*COLONIA:\s*(.+)/i,
      municipio: /NOMBRE\s*DEL\s*MUNICIPIO\s*O\s*DEMARCACIÓN\s*TERRITORIAL:\s*(.+)/i,
      entreCalle: /ENTRE\s*CALLE:\s*(.+)/i
    };

    const obtenerValor = (regex) => {
      const match = texto.match(regex);
      return match ? match[1] : "No encontrado";
    };

    // Datos del contribuyente
    const rfc = obtenerValor(regexes.rfc);
    const curp = obtenerValor(regexes.curp);
    const nombre = obtenerValor(regexes.nombre);
    const apellidoP = obtenerValor(regexes.apellidoP);
    const apellidoS = obtenerValor(regexes.apellidoS);
    const fOperaciones = obtenerValor(regexes.fOperaciones);
    const estatus = obtenerValor(regexes.estatus);
    const fCAmbioEstado = obtenerValor(regexes.fCAmbioEstado);
    let nomComercial = obtenerValor(regexes.nomComercial);

    // Datos del domicilio
    const cp = obtenerValor(regexes.cp);
    const vialidad = obtenerValor(regexes.vialidad);
    const numInt = obtenerValor(regexes.numInt);
    const localidad = obtenerValor(regexes.localidad);
    const entidadFederativa = obtenerValor(regexes.entidadFederativa);
    const numExterior = obtenerValor(regexes.numExterior);
    const colonia = obtenerValor(regexes.colonia);
    const municipio = obtenerValor(regexes.municipio);
    const entreCalle = obtenerValor(regexes.entreCalle);
    if (nomComercial === 'DATOS DEL DOMICILIO REGISTRADO ') {
      nomComercial = `${nombre} ${apellidoP} ${apellidoS}`
    }
    // Mostrar los datos extraídos
    console.log("Datos del Contribuyente:");
    console.log(rfc);
    console.log(curp);
    console.log(nombre);
    console.log(apellidoP);
    console.log(apellidoS);
    console.log(fOperaciones);
    console.log(estatus);
    console.log(fCAmbioEstado);
    console.log(nomComercial);

    console.log("\nDatos del Domicilio:");
    console.log(cp);
    console.log(vialidad);
    console.log(numInt);
    console.log(localidad);
    console.log(entidadFederativa);
    console.log(numExterior);
    console.log(colonia);
    console.log(municipio);
    console.log(entreCalle);

    const convertirFechaAObjetoDate = (fecha) => {

      const meses = {
        ENERO: '01',
        FEBRERO: '02',
        MARZO: '03',
        ABRIL: '04',
        MAYO: '05',
        JUNIO: '06',
        JULIO: '07',
        AGOSTO: '08',
        SEPTIEMBRE: '09',
        OCTUBRE: '10',
        NOVIEMBRE: '11',
        DICIEMBRE: '12'
      };


      const regexFecha = /(\d{2})(DE)([A-Z]+)(DE)(\d{4})/;
      const resultado = fecha.replace(/ /g, '').match(regexFecha);
      if (resultado) {
        const dia = resultado[1];
        const mesTexto = resultado[3];
        const anio = resultado[5];
        const mes = meses[mesTexto];
        const fechaFormateada = `${anio}-${mes}-${dia}`;
        const fechaDate = new Date(fechaFormateada);

        if (!isNaN(fechaDate)) {
          const diaFormateado = fechaDate.getDate().toString().padStart(2, '0');
          const mesFormateado = (fechaDate.getMonth() + 1).toString().padStart(2, '0');
          const anioFormateado = fechaDate.getFullYear();
          return `${diaFormateado}/${mesFormateado}/${anioFormateado}`;
          // return fechaDate;
        } else {
          return "Fecha no válida";
        }
      }

      return "Fecha no válida";
    };
    const fechaOpr = convertirFechaAObjetoDate(fOperaciones);
    const fechaEstado = convertirFechaAObjetoDate(fCAmbioEstado);
    console.log(fechaOpr)
    console.log(fechaEstado)
    const { insertarDatos } = require('./conexion.cjs');
    try {
      insertarDatos({
        curp: curp, rfc: rfc, apellido_materno: apellidoS, apellido_paterno: apellidoP, codigo_postal: cp, colonia: colonia, estatus_padron: estatus,
        fecha_ini_operaciones: fOperaciones, fecha_ult_camb_estado: fCAmbioEstado, municipio: municipio, nombre: nombre, nombre_comercial: nomComercial, direccion: (`${vialidad}`)
      })
    } catch (error) {
      console.log("Error en subir datos", error)
    }

  } catch (error) {
    console.error("Error al leer el CIF:", error);
  }

};

// Ejecutar la función
extraerDatosCIF(rutaPDF);