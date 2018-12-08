const Block = require('./block');

class Blockchain {
    constructor() {
        this.chain = [Block.genesis()];
    }

    addBlock(data) {
        const lastBlock = this.chain[this.chain.length - 1];
        const block = Block.mineBlock(lastBlock, data);
        this.chain.push(block);

        return block;
    }

    isChainValid(chain) {
        if(JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
            return false;
        }

        for(let i=1; i<chain.length; i++) {
            const block = chain[i];
            const lastBlock = chain[i-1];

            if(block.lastHash !== lastBlock.currentHash || block.currentHash !== Block.blockHash(block)) {
                return false;
            }
        }

        return true;
    }

    replaceChain(newChain) {
        if(newChain.length <= this.chain.length) {
            console.log('Received chain is not longer than the current chain');
            return;
        }

        if(!this.isChainValid(newChain)) {
            console.log('The received chain is invalid');
            return;
        }

        console.log('Replacing the current chain with the new one');
        this.chain = newChain;
    }
}

module.exports = Blockchain;