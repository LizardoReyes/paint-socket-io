module.exports = io => {
    let data = []
    let nUsers = 0
    io.on("connection", socket => {
        data.forEach(pointImage => {
            io.emit("show_drawing", pointImage)
        })

        nUsers++;
        io.emit("users", nUsers)

        socket.on("drawing", drawing => {
            data.push(drawing)
            io.emit("show_drawing", drawing)
        })

        socket.on("delete", () => {
            data = []
            io.emit("show_drawing", null)
        })

        socket.on("disconnect", () => {
            nUsers--;
            io.emit("users", nUsers)
        })
    })
}
