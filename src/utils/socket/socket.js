import { Server } from "socket.io";

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("HR User Connected:", socket.id);

    socket.on("registerUser", (userId) => {
      console.log(`HR user registered with ID: ${userId}`);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};
