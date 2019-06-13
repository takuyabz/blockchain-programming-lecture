
const ChainUtil = require('../chain-util');

class Transaction {
  constructor() {
    this.id = ChainUtil.id();
    this.input = null;
    this.outputs = [];
  }

  static newTransaction(senderWallet, receipient, amount) {
    if (amount > senderWallet.balance) {
      console.log(`金額： ${amount}が残高超過しています`);
      return;
    }

    const transaction = new this();

    transaction.outputs.push(...[
      { amount: senderWallet.balance - amount, address: senderWallet.publicKey},
      { amount, address: receipient}
    ]);

    return transaction;
  }
}

module.exports = Transaction;