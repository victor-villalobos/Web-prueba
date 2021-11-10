// Vamos a crear una base de datos para nuestros avatares ya creados

// Vamos a necesitar una librería existente en javascrip para crear una base de datos.
const fs = require("fs")

class DatabaseService {
    DB_FILE_PATH = __dirname + "/../.db.json" // Creamos la ruta donde se va a ubicar la base de datos. CONSTANTE = CARPETA ACTUAL + SUBIDA UN NIVEL Y CREAR CATEGORÍA SEÑALADA (.db.json) el sufijo nos permite su reconocimiento por visual studios y nos indica posibles errores.


    // Crea el archivo de la BD
    init() {
        fs.writeFileSync(this.DB_FILE_PATH, "{}") // Guardamos un srting o cadena de texto que luego podremos extraer como objeto javascrip (json)
    }
    //mira si la base de datos existe
    exists() {
        return fs.existsSync(this.DB_FILE_PATH) // Comprueba si existe una base de datos previa devolviendo true o false. Esto evita sobreexcribir datos.
    }

    // Para guardar cartas nuesvas. Dado una clave ("cards) y un objeto, guarda el onjeto en la lista"
    storeOne(key, instance) {
        const dbData = JSON.parse(fs.readFileSync(this.DB_FILE_PATH))
        let newDta = { ...dbData}

        if (!(key in newData)) {
            newData[key] = [instance]
        } else {
            newData[key].push(instance)
        }
        fs.writeFileSync(this.DB_FILE_PATH, JSON.stringify(newData))

        return newData
    }
    // Guarda los datos en la clave key
    store(key, data) {
        const dbData = JSON.parse(fs.readFileSync(this.DB_FILE_PATH)) // Traemos los datos desde la base de datos y convertimos el strin en json
        let newData = { ...dbData} // creamos un objeto nuevo en base a los datos anteriores
        newData[key] = data  //  almacenar los datos nuevos en la categoría o key que desamos
        // const jsonData = JSON.stringify(newData) // Guardamos los nuevos datos

        fs.writeFileSync(this.DB_FILE_PATH, JSON.stringify(newData))
        return newData
    }

    // Toma los datos basado en esta clave (key). En db.json habra dintintas fentes de datos agrupadas por clabves.
    get(key) {
        const dbData = JSON.parse(fs.readFileSync(this.DB_FILE_PATH))
        return dbData[key]
    }



}

module.exports = {
    DatabaseService
}