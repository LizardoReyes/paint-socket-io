const socket = io()
let click = false, movingMouse = false
let positionX = 0, positionY = 0
let positionPrevious = null
let selectColor = "black"

const canvas = document.querySelector("#canvas")
const context = canvas.getContext("2d")
const width = window.innerWidth, height = window.innerHeight
const users = document.querySelector("#users")

canvas.width = width
canvas.height = height

canvas.addEventListener("mousedown", event => {
    click = true
})

canvas.addEventListener("mouseup", event => {
    click = false
})

canvas.addEventListener("mousemove", event => {
    positionX = event.clientX
    positionY = event.clientY
    movingMouse = true
})

function createDrawing() {
    if(click && movingMouse && positionPrevious != null) {
        let drawing = { positionX, positionY, selectColor, positionPrevious }
        socket.emit("drawing", drawing)
    }
    positionPrevious = { positionX, positionY }
    setTimeout(createDrawing, 25)
}

socket.on("show_drawing", drawing => {
    if(drawing !== null) {
        context.beginPath()
        context.lineWidth = 3
        context.strokeStyle = drawing.selectColor
        context.moveTo(drawing.positionX, drawing.positionY)
        context.lineTo(drawing.positionPrevious.positionX, drawing.positionPrevious.positionY)
        context.stroke()
    } else {
        // limpiar el canvas
        context.clearRect(0, 0, canvas.width, canvas.height)
    }
})

createDrawing()

function changeColor(color) {
    selectColor = color
    context.strokeStyle = color
    context.stroke()
}

function deleteAll() {
    socket.emit("delete")
}

socket.on("users", nUsers => {
    users.innerHTML = `Número de usuarios conectados: ${nUsers}`
})
