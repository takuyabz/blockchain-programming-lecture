const Transaction = require('./transaction');
const Wallet = require('./index');

describe('Transaction', () => {
  let transaction, wallet, receipient, amount;
  beforeEach( () => {
    wallet = new Wallet();
    amount = 50;
    receipient = 'r2c1e0p24nt';
    transaction = Transaction.newTransaction(wallet, receipient, amount);
  });

  it('残高差し引きテスト', () => {
    expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
      .toEqual(wallet.balance - amount);
  });

  it('送金テスト', () => {
    expect(transaction.outputs.find(output => output.address == receipient).amount)
      .toEqual(amount);
  });

  describe('残高超過テスト', () => {
    beforeEach( () => {
      amount = 50000;
      transaction = Transaction.newTransaction(wallet, receipient, amount);
    });

    it('取引省略テスト', () => {
      expect(transaction).toEqual(undefined);
    })
  })
});