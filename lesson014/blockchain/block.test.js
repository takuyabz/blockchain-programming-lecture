const Block = require('./block');

describe('Block', () => {

  let data, lastblock, block;

  beforeEach(()=>{
    data = "sato";
    lastBlock = Block.genesis();
    block = Block.mineBlock(lastBlock, data);
    // block = Block.mineBlock(lastBlock, "yamada");
  });
  it('data test', ()=> {
    expect(block.data).toEqual(data);
  });

  it('hash test', () => {
    expect(block.lastHash).toEqual(lastBlock.hash);
    // expect(block.lastHash).toEqual("suzuki");
  });
});