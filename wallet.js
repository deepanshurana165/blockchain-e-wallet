const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const Transaction = require('./transaction');
const INITIAL_BALANCE = 0;

class Wallet {
    constructor() {
        this.balance = INITIAL_BALANCE;
        this.keyPair = ec.genKeyPair();
        this.publicKey = this.keyPair.getPublic().encode('hex');
    }

    toString() {
        return `Wallet
                publicKey: ${this.publicKey.toString()}
                balance: ${this.balance}`;
    }

    sign(dataHash) {
        return this.keyPair.sign((dataHash).toString());
    }

    createTransaction(recipient, amount, blockchain, transactionPool) {
        this.balance = this.calculateBalance(blockchain);
        if(amount > this.balance) {
            console.log(`Amount: ${amount} exceeds the current balance`);
            return;
        }

        let transaction = transactionPool.existingTransaction(this.publicKey);

        if(transaction) {
            transaction.update(this, recipient, amount)
        }
        else {
            transaction = Transaction.newTransaction(this, recipient, amount);
            transactionPool.updateOrAddTransaction(transaction);
        }

        // this.balance = this.calculateBalance(blockchain);
        return transaction;
    }

    calculateBalance(blockchain) {
        let balance = 0;
        let transactions = [];
        blockchain.chain.forEach(block => {
            block.data.forEach(transaction => {
                transactions.push(transaction);
            });
        });

        const walletInputTs = transactions.filter(transaction => transaction.input.address === this.publicKey);
        let startTime = 0;

        if(walletInputTs.length > 0) {
            const recentInputT = walletInputTs.reduce(
                (prev, current) => prev.input.timestamp > current.input.timestamp ? prev : current
            );

            balance = recentInputT.outputs.find(output => output.address === this.publicKey).amount;
            startTime = recentInputT.input.timestamp;
        }

        transactions.forEach(transaction => {
            if (transaction.input.timestamp > startTime) {
                transaction.outputs.find(output => {
                    if(output[0].address === this.publicKey) {
                        balance += output.amount;
                    }
                });
            }
        });
        return balance;
    }

    static blockChainWallet() {
        const blockChainWallet = new this();
        blockChainWallet.address = 'blockchain-wallet';
        return blockChainWallet;
    }
}

module.exports = Wallet;