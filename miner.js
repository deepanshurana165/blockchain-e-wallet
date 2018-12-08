const Wallet = require('./wallet');
const Transaction = require('./transaction');

class Miner {
    constructor(blockchain, transactionPool, wallet, p2pServer) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.wallet = wallet;
        this.p2pServer = p2pServer;
    }

    mine() {
        const validTransactions = this.transactionPool.validTransactions();
        validTransactions.push(Transaction.rewardTransaction(this.wallet, Wallet.blockChainWallet()));
        const block = this.blockchain.addBlock(validTransactions);
        this.p2pServer.syncChain();
        this.transactionPool.clear();
        this.p2pServer.broadClearTransactions();

        return block;
    }
}

module.exports = Miner;