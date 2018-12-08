const sha256 = require('crypto-js/sha256');
const DIFFICULTY = 4;
const MINE_RATE = 6000;

class Block {
    constructor(timestamp, lastHash, data, nonce, difficulty, hash) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.data =data;
        this.nonce = nonce;
        this.difficulty = difficulty || DIFFICULTY;
        this.currentHash = hash;
    }

    toString() {
        return `Block - 
            Timestamp: ${this.timestamp}
            Last Hash: ${this.lastHash}
            Data: ${this.data}
            Nonce: ${this.nonce}
            Difficulty: ${this.difficulty}
            Hash: ${this.currentHash}`;
    }

    static genesis() {
        return new this('Genesis Time', '------', [], 0, DIFFICULTY, 'f1r57-h45h');
    }

    static mineBlock(lastBlock, data) {
        let nonce = 0;
        let timestamp, hash;
        let { difficulty } = lastBlock;
        const lastHash = lastBlock.currentHash;
        do {
            nonce++;
            timestamp = Date.now();
            difficulty = Block.adjustDifficulty(lastBlock, timestamp);
            hash = Block.hash(timestamp, lastHash, data, nonce, difficulty);
        }while(hash.substring(0, difficulty) !== '0'.repeat(difficulty));

        return new this(timestamp, lastHash, data, nonce, difficulty, hash);
    }

    static hash(timestamp, lastHash, data, nonce, difficulty) {
        return sha256(`${timestamp}${lastHash}${data}${nonce}${difficulty}`).toString();
    }

    static blockHash(block) {
        let {timestamp, lastHash, data, nonce, difficulty} = block;
        return Block.hash(timestamp, lastHash, data, nonce, difficulty);
    }

    static adjustDifficulty(lastBlock, currentTime) {
        let { difficulty } = lastBlock;
        difficulty =  lastBlock.timestamp + MINE_RATE > currentTime ? difficulty + 1 : difficulty - 1;
        return difficulty;
    }
}

module.exports = Block;