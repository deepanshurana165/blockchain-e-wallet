const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('./blockChain');
const P2pServer = require('./p2pServer');
const Wallet = require('./wallet');
const TransactionPool = require('./transaction-pool');
const Miner = require('./miner');
const beautify = require("json-beautify");

const HTTP_PORT = process.env.HTTP_PORT || 9090;

const app = express();
const blockchain = new Blockchain();
const wallet = new Wallet();
const transactionPool = new TransactionPool();
const p2p = new P2pServer(blockchain, transactionPool);
const miner = new Miner(blockchain, transactionPool, wallet, p2p);
let allTransaction = [];
let moneySent = 0;

app.use(bodyParser.json());
app.use('/', express.static(__dirname+'/public_static'));

app.post('/login/addmoney', (req, res) => {
    console.log(req.body.amount);
    wallet.balance += parseInt(req.body.amount);
    res.end();
});

app.get('/getKeyPair', (req, res) => {
    const keyPair = {
        privKey: wallet.keyPair.priv,
        pubKey: wallet.publicKey,
        balance: wallet.balance
    };
    res.json(keyPair);
});

app.post('/login/privkey', (req, res) => {
    res.json({
        privKey: wallet.keyPair.priv,
        pubKey: wallet.publicKey,
        balance: wallet.balance
    });
});

app.get('/transactionHistory', (req, res) => {
    let history = {};
    for(let i=0; i<allTransaction.length; i++) {
        if(allTransaction[i].input.address === wallet.publicKey || allTransaction[i].outputs[0].address === wallet.publicKey) {
            history[`${i}`] = allTransaction[i];
        }
    }
    res.json(history);
});

app.get('/blocks', (req, res) => {
    console.log(blockchain.chain);
    res.json(blockchain.chain);
});

app.post('/mine', (req, res) => {
    const block = blockchain.addBlock(req.body.data);

    console.log(`New block added: ${block}`);
    p2p.syncChain();
    res.redirect('/blocks');
});

app.get('/transactions', (req, res) => {
    res.json(transactionPool.transactions);
});

app.post('/transact', (req, res) => {
    let { recipient, amount } = req.body;
    amount = parseInt(amount);
    moneySent = amount;
    console.log(moneySent);
    if(wallet.balance > moneySent) {
        // wallet.balance -= moneySent;
        // p2p.sendMoney(moneySent);
        const transaction = wallet.createTransaction(recipient, amount, blockchain, transactionPool);
        allTransaction.push(transaction);
        p2p.broadcastTransaction(transaction);
        res.redirect('/mine-transactions');
    }
    res.end();
});

app.get('/mine-transactions', (req, res) => {
   const block = miner.mine();
   console.log(`New block added: ${block.toString()}`);
   //
   // let tempChain = blockchain.chain;
   // let lastBlock = tempChain[tempChain.length - 1];
   // if(lastBlock.data.outputs[0].address === wallet.publicKey) {
   //     wallet.balance = lastBlock.data.outputs[0].amount;
   // }
   // else if (lastBlock.data.outputs[1].address === wallet.publicKey) {
   //     wallet.balance += lastBlock.data.outputs[1].amount;
   // }

   res.redirect('/getKeyPair');
    // res.redirect('/blocks');
});

app.get('/public-key', (req, res) => {
    res.json({publicKey: wallet.publicKey});
});

app.listen(HTTP_PORT, () => {
    console.log(`Listening on port ${HTTP_PORT}`);
});

p2p.listen();