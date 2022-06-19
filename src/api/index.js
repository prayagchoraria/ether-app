import { ethers } from 'ethers';

export const fetchBlocks = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
  const latestBlockNumber = await provider.getBlockNumber();

  const blocks = [];
  for (let i = 0; i < 10; i += 1) {
    const block = provider.getBlock(latestBlockNumber - i);
    blocks.push(block);
  }
  return Promise.all(blocks);
};
