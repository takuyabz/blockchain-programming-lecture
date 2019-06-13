const Block = require('./block');

describe('Block', () => {

  let data, lastblock, block;

  beforeEach(()=>{
    data = "sato";
    lastblock = Block.genesis();
    block = Block.mineBlock(lastblock, data);
    // block = Block.mineBlock(lastblock, "yamada");
  });
  it('data test', ()=> {
    expect(block.data).toEqual(data);
  });

  it('hash test', () => {
    expect(block.lastHash).toEqual(lastblock.hash);
    // expect(block.lastHash).toEqual("suzuki");
  });

  it('指定難易度のハッシュ値生成テスト', () => {
    expect(block.hash.substring(0,block.difficulty)).toEqual('0'.repeat(block.difficulty));
    console.log(block.toString());
  })

  it('低速ブロック採掘で難易度を下げるテスト', () => {
    expect(Block.adjustDifficulty(block, block.timestamp + 3600000)).toEqual(block.difficulty-1);
  })

  it('高速ブロック採掘で難易度を上げるテスト', () => {
    expect(Block.adjustDifficulty(block, block.timestamp + 1)).toEqual(block.difficulty+1);
  })
});