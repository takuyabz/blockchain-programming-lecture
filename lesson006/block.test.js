const Block = require('./block');

describe('Block', () => {

  let data, lastblock, block;

  beforeEach(()=>{
    data = "sato";
    lastBlock = Block.genesis();
    block = Block.mineBlock(lastBlock, data);
  });
  it('data test', ()=> {
    expect(block.data).toEqual(data);
  });

  it('hash test', () => {
    expect(block.lastHash).toEqual(lastBlock.hash);
  });
});