// Vamos a crear un servidor web

// Lo primero es instalar express y activarlo
const express = require("express")
// Vamos a requerir tambien el paquete de plantilla de HTML
const exphbs = require("express-handlebars")
// Vamos a metir un módulo que
const bodyParser = require("body-parser")
// A continuación creamos nuestra web y la llamamos "app"
const app = express()

// Este es un codigo que permite que el express pueda obtener información desde la web (ej: formularios.)
app.use(express.urlencoded({
  extended: true
}))
// vamos a establecer ciertas configuraciones de la plantilla de html en nuestra web.
app.engine("handlebars", exphbs())
app.set("view engine", "handlebars")
// Ahora debemos de habilitar o abrir un puerto para la aplicación que hemos creado. Para ello vamos a establecer una variable de entorno con una condicional por si no existiese ninguna.
const port = process.env.PORT || 3000

// Creamos una función de autentificación
function isAuthenticated(user, password) {
  return user == 'admin' && password == 'admin'
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

//vamos a crear una respuesta de formulario o solicitud
app.post("/hola", function(request, response){
  
  response.send("Es un post")
})

app.post("/contacto", function(request, response){
  console.log(request.body.email)
  console.log(request.body.message)

  // Para el envio de emails deberíamos obtar por serviciosweb ya establecidos que facilitan librerías de código y solo requieren una APY de activación.

  response.send("Mensaje enviado")
})

app.post("/login", function(request, response){
  const user = request.body.user
  const password = request.body.password
  if (isAuthenticated(user, password)) {
    //response.send("Datos correctos. ¡Exito!")
    response.redirect("/dashboard")
  } else {
    //response.send("Alguno de los datos introducidos es incorrecto. ¡error!")
    response.render("login", {message: "Alguno de los datos introducidos es incorrecto. ¡Error!"})
  }
  
})

// Vamos a crear una variable en la URL web para que nos lleve a la página deseada,. Es una consulta para traerme los datos solicitados. Habitualmente se indica una categoría principal donde s agrupan esos datos.

app.get('/users/:user', function(request, response){
  response.send(`Usuario ${request.params.user}`)
})

// Vamos a hacer que nuestra aplicación este atenta a los eventos que se producen en el puerto seleccionado.
app.listen(port, function(){
  console.log("Servidor iniciado")
  console.log(`El puerto usado es el ${port}.`)
})