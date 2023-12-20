const { Server, Socket } = require("socket.io");

const io = new Server(8000);

io.in("connection", (socket) => {
	console.log(`socket connected`, socket.id);
});
