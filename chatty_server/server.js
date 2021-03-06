// server.js

const express = require('express');
const SocketServer = require('ws').Server;

const uuidv1 = require('uuid/v1')

// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
    // Make the express server serve static assets (html, javascript, css) from the /public folder
    .use(express.static('public'))
    .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${PORT}`));

// Create the WebSockets server
const wss = new SocketServer({ server });

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
wss.on('connection', (ws) => {
    console.log('Client connected');
    const intialMsg = {id: uuidv1(), username: "Bobzx", content: "Hi" }
    ws.send(JSON.stringify(intialMsg)) // send to server 

    ws.on("message", function incoming(data){
        console.log('message received')
        console.log(data)

        wss.clients.forEach(function each(client) {
            console.log('sending for each client')
            // const test =  [{content:'test', id:'test', test:'test' , username:'test'}]
            const cleanData = JSON.parse(data)
            const stringifyData = JSON.stringify(cleanData)
            console.log('data strigfy', stringifyData)
            client.send(stringifyData)            
        } )
    })

    // Set up a callback for when a client closes the socket. This usually means they closed their browser.
    ws.on('close', () => console.log('Client disconnected'));
});