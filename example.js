/*

Interact with Foundry

Each command must take the following form:

>>> ${command name} ${params as json}

The command and params must be separated by a single space!

*/

const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 3000 })

let msgid = 0;

function handleMessage(msg) {
    const data = JSON.parse(msg);
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    console.dir(data.result);
    process.stdout.write(`>>> `);
}

function takeInput(ws) {
    rl.question(">>> ", (input) => {
        const firstSpace = input.indexOf(' ');
        const method = input.substr(0, firstSpace);
        const params = JSON.parse(input.substr(firstSpace + 1));
        ws.send(JSON.stringify({
            method, params,
            id: msgid++,
            jsonrpc: "2.0",
        }));
        takeInput(ws);
    })
}

wss.on('connection', ws => {
    ws.on('message', handleMessage);
    takeInput(ws);
})

console.log("Listening on 3000...");
