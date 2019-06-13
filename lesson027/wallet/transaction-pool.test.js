
const TransactionPool = require('./transaction-pool');
const Wallet = require('./index');

describe('TransactionPool', () => {
  let tp, transaction, wallet;
  beforeEach(() => {
    tp = new TransactionPool();
    wallet = new Wallet();
    transaction = wallet.createTransaction('rec134nt', 30, tp);
  });

  it('取引台帳追加テスト', () => {
    expect(tp.transactions.find(t => t.id === transaction.id)).toEqual(transaction);
  });

  it('取引台帳更新テスト', () => {
    const oldTransaction = JSON.stringify(transaction);
    const newTransaction = transaction.update(wallet, 'foo-ew145', 40);
    tp.updateOrAddTransaction(newTransaction);
    expect(JSON.stringify(tp.transactions.find(t => t.id === newTransaction.id)))
      .not.toEqual(oldTransaction);
  });

  describe('正常/不正取引混合テスト', () => {
    let validTransactions;
    beforeEach( () => {
      validTransactions = [...tp.transactions];
      for (let i = 0; i< 6; i++) {
        wallet = new Wallet();
        transaction = wallet.createTransaction('rec134nt', 30, tp);
        if (i%2 == 0 ) {
          transaction.input.amount = 99999;
        } else {
          validTransactions.push(transaction);
        }
      }
    });

    it('取引台帳と妥当性検証取引リストテスト' , () => {
      expect(JSON.stringify(tp.transactions)).not.toEqual(JSON.stringify(validTransactions));
    });

    it('妥当性検証取引リストテスト', () => {
      expect(tp.validTransactions()).toEqual(validTransactions);
    });

  })
})