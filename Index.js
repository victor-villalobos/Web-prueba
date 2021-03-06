// Vamos a crear un servidor web

// Lo primero es instalar express y activarlo
const express = require("express")
// Vamos a requerir tambien el paquete de plantilla de HTML
const exphbs = require("express-handlebars")
// vamos a requerir una librería que nos indica caundo hay peticiones a la web o servidor.
const morgan = require("morgan")
// Vamos a importar una librería para la gestión de datos.
const _ = require("lodash")
// Vamos a importar nuestro código de cartas (creación de cartas) y la base de datos
const {Card, CardRepository} = require("./models/card")
const {DatabaseService} = require("./services/database")
// Vamos a metir un módulo que
const bodyParser = require("body-parser")
// A continuación creamos nuestra web y la llamamos "app"
const app = express()


// Este es el código que nos permite usar la librería instalada. Lo especificado entre paréntesis se usa para determinar que información queremos visualizar.
app.use(morgan("dev"))

// Este es un codigo que permite que el express pueda obtener información desde la web (ej: formularios.)
app.use(express.urlencoded({
  extended: true
}))
app.use(express.static(__dirname + "/public")) // Esta línea es para indicar los archivos estaticos (pulicos) de la web. Aqui dentro almacenaremos los archivos javascrip que se ejecuntan dentro del navegador.

// Vamos aestablecer el uso de la librería bodyParser. Esto nos prmite trabajar con API.
app.use(express.json());

// vamos a establecer ciertas configuraciones de la plantilla de html en nuestra web.
app.engine("handlebars", exphbs())
app.set("view engine", "handlebars")
// Ahora debemos de habilitar o abrir un puerto para la aplicación que hemos creado. Para ello vamos a establecer una variable de entorno con una condicional por si no existiese ninguna.
const port = process.env.PORT || 3000

//Vamos a crear una nueva constante para la base de datos que agrupe a los nuevos datos
const db = new DatabaseService()

if(!db.exists()) {
    db.init()
}

// Creamos una función de autentificación
function isAuthenticated(user, password) {
  return user == 'admin' && password == 'admin'
}
// Creamos una función para comprobar campos rellenos
function checkValidCardValues(body) {
  return body.name && body.description && body.price
}
// Ahora vamos a crear la acción que ocurre cuando alguien entra en la web. Cuando alguien accede a la web hace un get y entonces se le transmite la información.
app.get("/", function(request, response){
  //response.send("Hola, esta es mi web con nodemon.")
  response.render("index")
})

app.get("/hola", function(request, response){
  response.send("Hola amigo")
})

app.get("/contacto", function(request, response){
  // Nos permite recoger los datos de contacto establecidos en el formulario.
  response.render("contact")
})

app.get("/login", function(request, response){
  // Nos permite recoger los datos de usuarios establecidos .
  response.render("login")
})

app.get("/dashboard", function(request, response){ // Creamos un dashboard para los usuarios admitidos o confirmados.
  // Nos permite recoger los datos de usuarios establecidos .
  response.render("dashboard")
})

app.get("/about", function(request, response){ // Página "sobre nosotros".
  // Nos permite recoger los datos de usuarios establecidos.
  response.render("about")
})

app.get("/cards", function(request, response){ // Creamos un página para poder colocar las coleccones de NFT u otros elementos.
  console.log(request.query.text)
  const query = request.query.text
  let cards

  if(query) {
      cards = db.search('cards', 'name', query)
  } else {
      cards = CardRepository.getCards()
  }
  response.render(
    'cards',
    {cards: cards, query: query}
  )
})

app.get("/cards/:id", function(request, response){ // creamos una ruta que nos lleve a una página donde se vea la carta que hemos seleccionado
  const card = db.findOne("cards", request.params.id) // Esta variable ejecuta una busqueda en la base de datos dentro de la clase "cards" y buscando el parámetro "id"
  if (card){
    response.render("card", {"card": card}) // La respuesta es llevarnos a la págia card que muestra la cartabuscada.
  } else {
    response.status(404).send() // status nos devuelve el estado de la página. De forma normal nos manda un estado 200 y como queremos un error tenemos que especificarlo. Para que funcione tenemos que hacer un ".send" para que se envie.
    return // tenemos que especificar un retorno para parar le proceso, si no se reenviaría y crashea
  }
  
})


app.get("/delete_card/:id", function(request, response) { // Vamos a crear una ruta que nos permita borrar cartas.
  const instanceId = request.params.id // De esta forma decimos la id asociada a la carta que queremos eliminar.
  db.removeOne("cards", instanceId) // Eliminamos de la clase (cards) en la base de datos el archivo especificado (instanceId)

  response.redirect("/cards")
})


//vamos a crear una respuesta de formulario o solicitud
app.post("/hola", function(request, response){
  
  response.send("Es un post")
})

app.post("/contacto", function(request, response){
  console.log(request.body.email)
  console.log(request.body.message)

  // Para el envio de emails deberíamos obtar por serviciosweb ya establecidos que facilitan librerías de código y solo requieren una APY de activación.
  // Como en la plantilla principal ya le tenemos creado una función de mensage en una variable de plantilla. Además, vamos a otorgarle una categoría o tipo para distinguir entre mensages de alerta y de información.
  response.render("contact", {message: "Mensaje enviado", message_error: false})
})

app.post("/login", function(request, response){
  const user = request.body.user
  const password = request.body.password
  if (isAuthenticated(user, password)) {
    //response.send("Datos correctos. ¡Exito!")
    response.redirect("/dashboard")
  } else {
    //response.send("Alguno de los datos introducidos es incorrecto. ¡error!")
    response.render("login", {message: "Alguno de los datos introducidos es incorrecto. ¡Error!", message_error: true})
  }
  
})

app.post("/about", function(request, response){
  
  // vamos a crear un mensaje cuando introduzca el email correctamente.
  response.render("about", {message: "suscrito correctamente", message_error: false})
})

app.post("/cards", function(request, response){
  // Establecemos las constantes en el formulario que van a permitir introducir datos en la creación de carta y que modifiquen los datos
  const cardName = request.body.name
  const description = request.body.description
  const price = request.body.price
  
  // Para crear la carta nueva. Estamos creando un nuevo objeto carta. Establecemos un condicional basado en una función creada previamente para comprobar si hay algo escrito en los apartados.
  if (!checkValidCardValues(cardName, description, price)) {
    response.status(404).render(
      "cards",
      {
        cards: new CardRepository().getCards(),
        message: "necesitamos que rellenes todos los campos para crear la carta",
        message_error: true
      }
    )
      return
  } 


  const newCard = new Card(cardName, description, price)
  // Guardar la carta nueva en la base de datos. Ya tenmos la constante que se refiere a esta clase creada al inicio y por tanto solo la tenemos que usar. Primero definimos la clas donde la queremos guardar y despues el objeto (newCard) que queremos incorporar.
  db.storeOne("cards", newCard)
  // respuesta enviada. Hacemos una redirección a la página de cartas, de forma que se actualizara automáticamente el repositorio de cartas
  response.redirect("/cards") 
})

// Vamos a crear la opción de busqueda
app.post('/search', (request, response) => {
  // Buscar en cards por nombre
  cards = db.search('cards', 'name', request.body.query)

  // Hacer un render con los cartas elegidas
  response.render('cards', {cards: cards})
})


// Vamos a crear una variable en la URL web para que nos lleve a la página deseada,. Es una consulta para traerme los datos solicitados. Habitualmente se indica una categoría principal donde s agrupan esos datos.
app.get('/users/:user', function(request, response){
  response.send(`Usuario ${request.params.user}`)
})

// Api para el recurso cards (GET POST PUT/PATCH DELETE) API Rest JSON
// para listar un recurso (cards) - get /api/v1/cards
app.get("/api/v1/cards", function(request, response){ 
  const cards = new CardRepository().getCards() // traemos las cartas existentes
  response.send(cards)
})
// Muestra una carta - Get /api/v1/cards/:id
app.get("/api/v1/cards/:id", function(request, response){ 
  const card = db.findOne("cards", request.params.id)
  
  if (!card) {
    response.status(404).send(
      {"error:": 404, "message": "No existe el recurso 404"}
    )
    return
  }
  response.send(card)
})

// Crear una carta - Post /api/v1/cards
app.post("/api/v1/cards", function(request, response){ 
  if (!checkValidCardValues(request.body)) { // establecemos un error si no se rellenan los campos solicitados
    response.status(400).send(
      {
        "error": 400,
        "message": "No has rellenado todos los datos obligatorios: name, description, price"
      }
    )
    return
  }
  
  const card = new Card( //Establecemos la constante carta para la carta qye vamos a crear gracias a la llamada a "card" (función del constructor).
    request.body.name,
    request.body.description,
    request.body.price
  )
  db.storeOne("cards", card) // Guardamos la nueva carta en la sección de "cards"
  response.status(201).send(card)
})

// Editar un elemento -  Put /api/v1/cards/:id
app.put("/api/v1/cards/:id", function(request, response){ 
  let card = db.findOne("cards", request.params.id)
  
  // solo se puede editar nam, price y description. Si me llegan estos valores permitimos editar, pero si no llega ninguno o cualquier otro se devuelve un 404
  if (!card) {
    response.status(404).send(
      {"error:": 404, "message": "No existe el recurso 404"}
    )
    return
  } 
  
  const cardRequest = _.pick(request.body, ["name", "price", "description"])
  
  if (_.isEmpty(cardRequest)) {
    response.status(404).send(
      {"error:": 404, "message": "No existe el recurso 404"}
    )
    return
  } 
  
  const cardEdited = {...card, ...cardRequest}
  db.updateOne("cards", cardEdited)
  db.storeOne("cards", card)
  
  response.send(card)
})

// Eliminar un elemento -  Delete /api/v1/Cards/:id
app.delete("/api/v1/cards/:id", function(request, response){ 

  if (!db.findOne("cards", request.params.id)) {
    response.status(404).send(
      {"error:": 404, "message": "No existe el recurso 404"}
    )
    return
  }
  db.removeOne("cards", request.params.id) 
  response.status(204).send()
  
})



// Vamos a hacer que nuestra aplicación este atenta a los eventos que se producen en el puerto seleccionado.
app.listen(port, function(){
  console.log("Servidor iniciado")
  console.log(`El puerto usado es el ${port}.`)
})