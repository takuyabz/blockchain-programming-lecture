const Block = require("./block");
const fooBlock = Block.mineBlock(Block.genesis(), "hoge");
console.log(fooBlock.toString());
