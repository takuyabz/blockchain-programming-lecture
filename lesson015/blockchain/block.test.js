const Block = require('./block');
const { DIFFICULTY } = require('../config');

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
    expect(block.hash.substring(0,DIFFICULTY)).toEqual('0'.repeat(DIFFICULTY));
    console.log(block.toString());
  })
});
