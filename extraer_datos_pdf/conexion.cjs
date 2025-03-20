const fb = require('node-firebird');
const iconv = require('iconv-lite');
// Información de conexión a la base de datos
const opciones = {
    host: '10.1.18.203',
    port: 3050,
    database: 'Afiliados',
    user: 'JPONCE',
    password: '456123',
    charset: 'UTF8',
};


const insertarDatos = ({ curp, rfc, nombre, apellido_paterno, apellido_materno, fecha_ini_operaciones, estatus_padron, fecha_ult_camb_estado, nombre_comercial, codigo_postal, municipio, colonia, direccion }) => {
    fb.attach(opciones, (err, db) => {
        if (err) {
            console.error('Error de conexión:', err);
            return;
        }


        const query = `
            INSERT INTO CONSTANCIAS_DATOS_PERSONALES (
                CURP, RFC, NOMBRE, APELLIDO_PATERNO, APELLIDO_MATERNO, FECHA_INI_OPERACIONES, ESTATUS_PADRON, FECHA_ULT_CAMB_ESTADO, NOMBRE_COMERCIAL, CODIGO_POSTAL, MUNICIPIO, COLONIA, DIRECCION
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        // Ejecutar la consulta con los valores
        db.query(query, [curp, rfc, nombre, apellido_paterno, apellido_materno, fecha_ini_operaciones, estatus_padron, fecha_ult_camb_estado, nombre_comercial, codigo_postal, municipio, colonia, direccion], (err, result) => {
            if (err) {
                console.error('Error al insertar los datos:', err);
            } else {
                console.log('Datos insertados exitosamente:', result);
            }


            db.detach();
        });
    });
};

module.exports = { insertarDatos };
