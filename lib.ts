import * as http from "http";
import { Server, Socket } from "socket.io";

export function displayNetworkAddresses() {
  const { networkInterfaces } = require("os");

  const nets = networkInterfaces();
  const ipv4Addresses = Object.create(null);

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
      const familyV4Value = typeof net.family === "string" ? "IPv4" : 4;
      if (net.family === familyV4Value && !net.internal) {
        if (!ipv4Addresses[name]) {
          ipv4Addresses[name] = [];
        }
        ipv4Addresses[name].push(net.address);
      }
    }
  }

  console.log("available ip addresses: ");
  for (const key in ipv4Addresses) {
    if (Object.prototype.hasOwnProperty.call(ipv4Addresses, key)) {
      const element = ipv4Addresses[key];
      console.log(element);
    }
  }
}

export function setupCommunication() {
  displayNetworkAddresses();
  const server: http.Server = http.createServer();
  const io: Server = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  return {
    server,
    io,
  };
}
