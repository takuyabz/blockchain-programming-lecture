const Transaction = require('./transaction');
const ChainUtil = require('../chain-util');
const { INITIAL_BALANCE } = require('../config');

class Wallet {
  constructor() {
    this.balance = INITIAL_BALANCE;
    this.keyPair = ChainUtil.genKeyPair();
    this.publicKey = this.keyPair.getPublic().encode('hex');
  }

  toString() {
    return `Wallet -
      publicKey : ${this.publicKey.toString()}
      balance   : ${this.balance}`;
  }

  sign(dataHash) {
    return this.keyPair.sign(dataHash);
  }

  createTransaction(receipient, amount, transactionPool) {
    if (amount > this.balance) {
      console.log(`金額： ${amount}が残高超過しています。`);
      return;
    }

    let transaction = transactionPool.existingTransaction(this.publicKey);

    if (transaction) {
      transaction.update(this, receipient, amount);
    } else {
      transaction = Transaction.newTransaction(this, receipient, amount);
      transactionPool.updateOrAddTransaction(transaction);
    }

    return transaction;

  }

  static blockchainWallet() {
    const blockchainWallet = new this();
    blockchainWallet.address = 'blockchain-address';
    return blockchainWallet;
  }
}

module.exports = Wallet;