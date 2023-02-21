"use strict";

import { Socket } from "socket.io";

import { setupCommunication } from "./lib";
import { Room, Session, User, FeedItem } from "./interfaces";

const { server, io } = setupCommunication();

let numConnectedPlayers: number = 0;

let users: User[] = [{ name: "Cristi", password: "1234" }];
let sessions: Session[] = [{ name: "Cristi", token: "qwerty" }];

const authenticate = (name: string) =>
  !!users.find((user) => user.name === name);
const token = (name: string) =>
  sessions.find((session) => session.name === name)?.token;

let feeds: FeedItem[] = [ {type: 'like_post', text: 'Okey!', name: 'Ana'} ];
let chatRooms: Room[] = [
  {
    id: "12345",
    name: "Griffindorz",
    messages: [
      {
        id: "1",
        message: "Salutare",
        isSender: false,
        messageTime: "10:48 am",
      },
      {
        id: "2",
        message: "Salutaree",
        isSender: false,
        messageTime: "10:49 am",
      },
    ],
  },
  {
    id: "666",
    name: "Da hood",
    messages: [
      {
        id: "1",
        message: "Ahoy",
        isSender: false,
        messageTime: "10:49 am",
      },
    ],
  },
  {
    id: "66",
    name: "hood",
    messages: [
      {
        id: "1",
        message: "Bonjour Madamme",
        isSender: false,
        messageTime: "10:49 am",
      },
    ],
  },
];

const userConnection = (socket: Socket) => {
  console.log(`User ${socket.id} connected 🔥🔥🔥`);

  numConnectedPlayers++;
  io.emit("players", numConnectedPlayers);

  users.push({
    id: socket.id,
    name: Math.random().toString(36).substring(2, 7),
  });

  socket.emit("userList", users);

  setTimeout(() => {
    io.emit("chatMsg", "hi snitchez@" + Date.now());
  }, 2000);

  socket.on("createRoom", (name) => {
    Object;
    socket.emit("roomsList", chatRooms);
  });

  socket.on("findRoom", (id) => {
    let result = chatRooms.filter((room) => room.id == id);
    Boolean(result[0].messages) && socket.emit("foundRoom", result[0].messages);
  });

  socket.on("newMessage", (data) => {
    const { room_id, message, user, timestamp } = data;
    const { text } = message;
    console.log("text->>", text);
    let result: Room[] = chatRooms.filter((room) => room.id == room_id);
    const newMessage = {
      id: "1",
      message: text,
      isSender: false,
      messageTime: "ss",
    };

    console.log("New Message", newMessage);
    // socket.to('12345').emit("roomMessage", newMessage);
    result[0].messages.push(newMessage);

    socket.emit("roomsList", chatRooms);
    socket.emit("foundRoom", result[0].messages);
  });

  socket.on("getRoomsList", () => {
    socket.emit("roomsList", chatRooms);
  });

  socket.on("disconnect", () => {
    numConnectedPlayers--;
    io.emit("players", numConnectedPlayers);
    socket.disconnect();
    console.log("🔥: A user disconnected");
  });
};

io.on("connection", userConnection);

server.listen(3000, () => {
  console.log("Listening on port 3000");
});
