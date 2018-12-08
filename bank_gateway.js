const express = require('express');
const route = express.Router();
const Wallet = require('/wallet');

route.use(express.json());
route.use(express.urlencoded({extended: true}));

let wallet = new Wallet();

route.post('/', (req, res, next) => {
   let amount = req.body.amount;
});

module.exports = route;