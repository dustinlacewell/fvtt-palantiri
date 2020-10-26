// import "@hooks/init";
// import "@hooks/setup";
// import "@hooks/ready";
// import "@hooks/renderSceneControls";
import JSONRPC from "jsonrpc-lite"

import NestedProperty from "nested-property";
import server from "./rpc";

const url = "ws://localhost:3000";
const ws = new WebSocket(url);

ws.onopen = (e) => {
    console.log("Connected to server.");
}

async function handleRequest({ id, method, params }) {
    const [ns, name] = method.split(".");
    return Promise.resolve(server.run(ns, name, params));
}

async function handleMessage(message) {
    const result = await handleRequest(message.payload);
    if (message.type == "request") {
        ws.send(JSON.stringify(JSONRPC.success(message.payload.id, result)));
    }
}

async function handleMessages(messages) {
    const results = [];

    for (let message of messages) {
        const result = await handleRequest(message.payload);
        if (message.type == "request") {
            results.push(JSONRPC.success(message.payload.id, result));
        }
    }

    ws.send(JSON.stringify(results));
}

ws.onmessage = async (e) => {
    console.log("Got message: " + e.data);
    const message = JSONRPC.parse(e.data) as any;
    if (Array.isArray(message)) {
        handleMessages(message);
    } else {
        handleMessage(message)
    }
}

window["rpc"] = server;

export * from "./api";

export { NestedProperty };
