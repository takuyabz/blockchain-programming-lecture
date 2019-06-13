
const Wallet = require('./index');
const TransactionPool = require('./transaction-pool');

describe('Wallet', () => {
  let wallet, tp;
  beforeEach( () => {
    wallet = new Wallet();
    tp = new TransactionPool();
  });

  describe('取引作成テスト', () => {
    let transaction, sendAmount, receipient;
    beforeEach(() => {
      sendAmount = 50;
      receipient = 'r39310-3ndrs';
      transaction = wallet.createTransaction(receipient,sendAmount,tp);
    });

    describe('同一取引生成テスト', () => {
      beforeEach(()=>{
        wallet.createTransaction(receipient, sendAmount, tp);
      });

      it('残高から倍額差し引かれる', () => {
        expect(transaction.outputs.find(output => output.address ===  wallet.publicKey).amount)
          .toEqual(wallet.balance - sendAmount * 2);
      });

      it('送り先への取引金額起票テスト', () => {
        expect(transaction.outputs.filter(output => output.address === receipient)
          .map(output => output.amount)).toEqual([sendAmount, sendAmount]);
      });
    });
  })
})