import '@testing-library/jest-dom';
import { waitFor } from '@testing-library/react';
import { ethers } from 'ethers';
import { fetchBlocks, fetchBlockTransactions } from '.';

jest.mock('ethers');

const getBlockNumber = jest.fn();
const getBlock = jest.fn();
const getBlockWithTransactions = jest.fn();
const Provider = jest.fn();
Provider.prototype.getBlockNumber = getBlockNumber;
Provider.prototype.getBlock = getBlock;
Provider.prototype.getBlockWithTransactions = getBlockWithTransactions;
ethers.providers.Web3Provider = Provider;

describe.only('API', () => {
  it('function fetchBlocks returns as expected', async () => {
    getBlockNumber.mockResolvedValue(10);
    getBlock.mockImplementation((i) => Promise.resolve(i));

    const output = await fetchBlocks();
    const blocks = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

    expect(ethers.providers.Web3Provider).toHaveBeenCalled();
    expect(getBlockNumber).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(getBlock).toHaveBeenCalledTimes(10);
      blocks.forEach((block) => {
        expect(getBlock).toHaveBeenCalledWith(block);
      });
      expect(output).toStrictEqual(blocks);
    });
  });

  it('function fetchBlockTransactions returns as expected', async () => {
    getBlockWithTransactions.mockImplementation(() => Promise.resolve(1));

    const output = await fetchBlockTransactions();

    expect(ethers.providers.Web3Provider).toHaveBeenCalled();

    await waitFor(() => {
      expect(getBlockWithTransactions).toHaveBeenCalledTimes(1);
      expect(output).toStrictEqual(1);
    });
  });
});
