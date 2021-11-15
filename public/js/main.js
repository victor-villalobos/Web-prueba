console.log("hola")

// Vamos a hacer que cuando clikemos en el boton cuya id es "delete-card-item" se ejecute una función que nos acceda a ese archivo. En ese archivo se encuentra la id

$(".delete-card-item").click(function() {
    console.log("clicado")
    console.log($(this).data)
    const cardID = $(this).data("card-id") // $ es una función que permite acceder a los datos especificados por el "this".
    $("#delete-card-button").prop("href", `/delete_card/${cardID}`) // esto le otorga la id del delete-card-item al href de acceso.
})

// Vamos a crear un código que nos permita recoger la información introducida en el formulario de creación de cartas. En caso de que este vacío ejecute una función.
$('#create-card-button').click(function() {
    console.log('Click')
    const name = $('input[name="name"]').val()
    const description = $('input[name="description"]').val()
    const price = $('input[name="price"]').val()

    // Cuando estos valores esten vacios mostramos un mensaje de error y paramos el click.
    // Tenemos deshabilitado el botón de crear y sólo lo habilitamos cuando hayamos metido todos los valores.
})

$('input[name="name"]').change(function() {
    const nameValue = $(this).val()
    const buttonTarget = $('#create-card-button')

    // si el nameValue tiene una valor (algo escrito) entonces s true y se cumple la primera condicion cambiando el disabled del boton a false (desactivado).
    if (nameValue) { 
        //$('#create-card-button').prop('disabled', false)
        buttonTarget.prop('disabled', false)
    } else {
        // $('#create-card-button').prop('disabled', "disabled")
        buttonTarget.prop('disabled', 'disabled')
    }
})

const showNotification = function(message, isError = false) {
    let notification = $("<div>").addClass("alert alert-success").prop("role", "alert")
    notification.text(message)
    if (isError){
        notification.removeClass("alert-success").addClass("alert-danger")
    }
    $("#notifications").empty().append(notification)
}

// Queremos que al clickar sibre una imagen de carta nos aparezca un mensaje de success que diga "has clicado la carta con el id ......."
$(".card-item").click(function() {
    const cardID = $(this).data("card-id")
    console.log(`Has clicado la carta con id: ${cardID}`)
    const message = `Has clicado la carta con id: ${cardID}`
    showNotification(message)
})