// Vamos a crear una base de datos para nuestros avatares ya creados

// Vamos a necesitar una librería existente en javascrip para crear una base de datos. Es un módulo de gestión de archivos.
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

    // Para guardar cartas nuesvas. Creamos una función que dado una clave ("cards) y un objeto, guarda el onjeto en la lista".
    storeOne(key, instance) {
        const dbData = JSON.parse(fs.readFileSync(this.DB_FILE_PATH)) //Establecemos una constante que lea un archivo concreto (especificado en paréntesis)de forma sincrónica (si no se lee no avanza el código). Además, como el archivo es de cadena de texto lo transformamos en un objeto json que sea usable por javascrip.
        let newData = { ...dbData} // establecemos una variable con todas las propiedades especificadas entre llavas. Los puntos son una forma de decir todos las propiedades.

        if (!(key in newData)) { // si la clave que usamos no esta en la lista se transforma en una lista
            newData[key] = [instance]
        } else { // Si la clave que usamos esta en la base de datos lo introducimos al final.
            newData[key].push(instance)
        }
        fs.writeFileSync(this.DB_FILE_PATH, JSON.stringify(newData, null, "\t")) // se usa para sobreescribir archivos. Primero se especifica donde vamos a escribir y despues se especifica que datos se van a escribir. Normalmente con especificar el nombre de los archivos que queremos copiar es suficiente, pero hemos añadido (, null, " ") para que la base de datos aparezca ordenada y (, null, "\t") para añadirle una tabulación.

        return newData
    }
    // Guarda los datos en la clave key
    store(key, data) {
        const dbData = JSON.parse(fs.readFileSync(this.DB_FILE_PATH)) // Traemos los datos desde la base de datos y convertimos el strin en json
        let newData = { ...dbData} // creamos un objeto nuevo en base a los datos anteriores
        newData[key] = data  //  almacenar los datos nuevos en la categoría o key que desamos
        // const jsonData = JSON.stringify(newData) // Guardamos los nuevos datos

        fs.writeFileSync(this.DB_FILE_PATH, JSON.stringify(newData, null, "\t")) // 
        return newData
    }

    // Toma los datos basado en esta clave (key). En db.json habra dintintas fentes de datos agrupadas por clabves.
    get(key) {
        const dbData = JSON.parse(fs.readFileSync(this.DB_FILE_PATH))
        return dbData[key]
    }

    // Vamos a crear una clase que nos permita borrar un archivo en base a una clave dada.
    removeOne(key, instanceId){
        const elementList = this.get(key)
        const itemToRemoveIndex = elementList.findIndex(item => item.id === instanceId) // usamos una función de busqueda por posición index (indice en la lista de objetos) para determinar el objeto que hemos decidido eliminar
        elementList.splice(itemToRemoveIndex, 1) // Esta función elimina el item o elemento en base a su posición en la lista de objetos y se indica cuantos objetos se eliminanr (en este caso 1)
        this.store(key, elementList) // Guardamos la nueva lista usando la clase ya creada previamente (store) y especificando en que se basa para sobre escribir.
    }

    // Vamos a crear una clase que nos permita buscar objetos en la base de datos al especificar un parámetro (id en este caso)
    findOne(key, instanceId) {
        const elementList = this.get(key) // Creamos una función que busque dento del objeto get que hemos creado.
        return elementList.find(item => item.id === instanceId) // return elementList.find(funtion (item) {return item.id === instanceId})  
    }
    
    //Vamos a crear una clase para qmodificar objetos.
    updateOne(key, instance) {
        let resourceList = this.get(key)
        const itemToEditIndex = resourceList.findIndex( item => item.id === instance.id)
        resourceList[itemToEditIndex] = instance
        this.store(key, resourceList)
    }

    // Vamos a crear una clas para buscar.
    search(key, property, query) {
        const resourceList = this.get(key)
        return resourceList.filter(resource => resource[property].toLowerCase().includes(query.toLowerCase()))
    }
}

module.exports = {
    DatabaseService
}