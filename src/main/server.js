// Declare a route

import ciao, { getResponder } from "@homebridge/ciao";

// import Fastify from "fastify";
// import fastifyStatic from "@fastify/static";
// import path from "path";
const Fastify = require("fastify");
const fastifyStatic = require("@fastify/static");
const path = require("path");

let fastify;
let responder;

export const startServer = async (location) => {
  if (!fastify) {
    fastify = Fastify({ forceCloseConnections: true });

    fastify.register(fastifyStatic, {
      root: path.normalize(location),
      prefix: "/",
      list: {
        format: "html",
        render: (dirs, files) => {
          return `
<!DOCTYPE html>
<html>
<head>
<script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-200 p-8">
<div class="container mx-auto">
  <ul class="space-y-4">
  ${dirs
    .map(
      (dir) =>
        `<li class="flex items-center bg-white px-4 py-3 rounded-md shadow-md">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-orange-500">
        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
      </svg>
      <a href="${dir.href}" class="ml-2">${dir.name}</a>
    </li>`
    )
    .join("\n  ")}
  </ul>
  <ul class="space-y-4 mt-4">
  ${files
    .map(
      (file) =>
        ` <li class="flex items-center bg-white px-4 py-3 rounded-md shadow-md">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6 text-blue-500"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
          />
        </svg>
        <a href="${file.href}" target="_blank" class="ml-2">
        ${file.name}
        </a>
      </li>`
    )
    .join("\n  ")}
  </ul>
</div>
</body>
</html>`;
        },
        names: ["index", "index.json", "/"],
      },
    });

    try {
      await fastify.listen({ host: "0.0.0.0", port: 1234 });
      responder = getResponder(fastify.server.address().port);
      const service = responder.createService({
        name: "FileServer",
        type: "http",
        port: fastify.server.address().port,
        txt: {
          path: location,
        },
      });
      await service.advertise();
    } catch (err) {
      fastify.log.error(err);
      fastify = undefined;
      return true; // Indicate error during startup
    }
  }

  return false; // Server already started or started successfully
};

export const stopServer = async () => {
  if (fastify) {
    fastify.log.info("Closing server...");
    // Close all active connections forcefully
    await fastify.close();
    if (responder) {
      await responder.shutdown();
    }
    fastify = undefined;
  }
  return true;
};

export const getAddresses = () => {
  let os = require("os");

  let interfaces = os.networkInterfaces();
  let addresses = [];
  for (let k in interfaces) {
    for (let k2 in interfaces[k]) {
      let address = interfaces[k][k2];
      if (address.family === "IPv4" && !address.internal) {
        addresses.push(address.address);
      }
    }
  }
  return addresses;
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
