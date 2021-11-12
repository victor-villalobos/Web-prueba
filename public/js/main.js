console.log("hola")

// Vamos a hacer que cuando clikemos en el boton cuya id es "delete-card-item" se ejecute una función que nos acceda a ese archivo. En ese archivo se encuentra la id

$(".delete-card-item").click(function() {
    console.log("clicado")
    alert("clicado")
    console.log(this.data)
    $("#delete-card-button").prop("href", "...") // esto le otorga la id del delete-card-item al href de acceso.
})