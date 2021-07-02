const express = require('express');
const Blockchain = require('./blockchain');
const bodyParser = require('body-parser');
const request = require('request');
const PubSub = require('./pubsub');

const app = express();
const blockchain = new Blockchain();
const pubsub = new PubSub({ blockchain })

const DEFAULT_PORT = 3000;
const ROOT_NODE_ADRESS = `http://localhost:${DEFAULT_PORT}`;

setTimeout(() => pubsub.broadcastChain(), 1000);

app.use(bodyParser.json());

app.get('/api/blocks', (req, res) => {
    res.json(blockchain.chain);
});

app.post('/api/mine', (req, res) => {
    const { data } = req.body;
    blockchain.addBlock({ data });
    pubsub.broadcastChain();
    res.redirect('/api/blocks');
})

const syncChains = () => {
    request({ url: `${ROOT_NODE_ADRESS}/api/blocks` }, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const rootChain = JSON.parse(body);
            console.log('replace chain on a sync width', rootChain);
            blockchain.replaceChain(rootChain);
        }
    });
}

let PEER_PORT;

if (process.env.GENERATE_PEER_PORT === 'true') {
    PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}

const PORT = PEER_PORT || DEFAULT_PORT;
app.listen(PORT, () => {
    console.log(`listening at localhost:${PORT}`)
    syncChains();
});