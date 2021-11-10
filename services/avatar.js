// Vamos a crear los avartares como hicimos con las cartas
class AvatarService {

    //Vamos a crear una función que haga el nombre único
    getUniqueAvatarFromName(name){
        const nameURI = encodeURI(name) + this.getTimestamp()
        return this.getAvatarFromName(nameURI)
    }
    // Con esta función estatica obtendremos un avatar desde la API en función del nombre de la carta que tengamos.
    getAvatarFromName (name) { 
        return `https://avatars.dicebear.com/api/human/${name}.svg`
    }

    // Cremaos una función para crear un código único. Para ello utiliza un contador que empezo a funcionar en 1960.
    getTimestamp() {
        return Math.floor(Date.now() / 1000)
    }
}

module.exports = {
    AvatarService
}