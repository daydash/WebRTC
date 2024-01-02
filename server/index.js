// const express = require("express");
// const http = require("http");
const { Server } = require("socket.io");

// const app = express();
// const httpServer = http.createServer(app);

const io = new Server(8000, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
	},
});

const emailToSocketIdMap = new Map();
const SocketIdToEmailMap = new Map();

io.on("connection", (socket) => {
	console.log(`socket connected`, socket.id);
	socket.on("room:join", (data) => {
		const { email, room } = data;
		emailToSocketIdMap.set(email, socket.id);
		SocketIdToEmailMap.set(socket.id, email);
		io.to(room).emit("user:joined", { email, id: socket.id });
		socket.join(room);
		io.to(socket.id).emit("room:join", data);
	});

	socket.on("user:call", ({ to, offer }) => {
		io.to(to).emit("incomming:call", { from: socket.id, offer });
	});

	socket.on("call:accepted", ({ to, ans }) => {
		io.to(to).emit("call:accepted:second", { from: socket.id, ans });
	});

	socket.on("peer:nego:needed", ({ to, offer }) => {
		io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
	});

	socket.on("peer:nego:done", ({ to, ans }) => {
		io.to(to).emit("peer:nego:final", { from: socket.id, ans });
	});
});
