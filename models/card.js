// Vamos a crear este archivo para poder crear nuestras cartas sin tener que tener este código en el index.js principal.
// Creamos la clase "card" 

// Vamos a importar los avatares creados en otro código
const {v4 : uuidv4} = require("uuid")
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
    constructor(cardName) { // Este es el constructor de nuevas cartas 
        this.id = uuidv4()// Vamos a generar un ID único
        this.name = cardName
        this.price = 0.12
        this.description = "Descripcion"
        this.avatar = new AvatarService().getAvatarFromName(this.id)
        console.log("Cargando Card")
    }

}

// Vamos a exportarlo al código principal
module.exports = {
    Card, CardRepository
}