const Wallet = require('../wallet');
const Transaction = require('../wallet/transaction');

class Minner {
  constructor(blockchain, transactionPool, wallet, p2pServer) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.wallet = wallet;
    this.p2pServer = p2pServer;
  }

  mine() {
    const validTransaction = this.transactionPool.validTransaction();
    validTransaction.push(
      Transaction.rewardTransaction(this.wallet, Wallet.blockchainWallet())
    );

    const block = this.blockchain.addBlock(validTransactions);
    this.p2pServer.syncChain();
    this.transactionPool.clear();
    

  }
}

module.exports = Minner;