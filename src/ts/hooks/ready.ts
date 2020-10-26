import JSONRPC from "jsonrpc-lite"

import server from "@src/rpc";


Hooks.once('ready', async function() {
    const url = "ws://localhost:3000";
    const ws = new WebSocket(url);

    ws.onopen = (_) => {
        console.log("Connected to server.");
    }

    async function handleRequest({ method, params }) {
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
    };
});
