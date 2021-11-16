// Vamos a crear este archivo para poder crear nuestras cartas sin tener que tener este código en el index.js principal.
// Creamos la clase "card" 

// Vamos a importar los avatares creados en otro código
const {v4 : uuidv4} = require("uuid") // Es una importanción de un módulo que hemos instalado.
const {AvatarService} = require("../services/avatar")
const {DatabaseService} = require("../services/database")

//Vamos a crear un repositorio de cartas
class CardRepository {
    constructor() {}

    getCards() {
        // const avatar = new AvatarService
        const database = new DatabaseService()
        return database.get("cards")
    }

}


class Card {
    constructor(cardName, description, price) { // Este es el constructor de nuevas cartas y especificamos los aspectos que van a ser susceptibles de modificación
        this.id = uuidv4() // Vamos a generar un ID único mediante una función de una librería descargada
        this.name = cardName
        this.description = description
        this.price = price
        this.avatar = new AvatarService().getAvatarFromName(this.id) // usamos el id único generado en este código para usar la función de grear un nuevo avatar. Esta funciñon se aloja en el archivo "avatar.js", en la clase especificada.
        console.log("Cargando Card")
    }

}

// Vamos a exportarlo al código principal
module.exports = {
    Card, CardRepository
}