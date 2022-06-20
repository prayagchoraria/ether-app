import '@testing-library/jest-dom';
import { waitFor } from '@testing-library/react';
import { ethers } from 'ethers';
import {
  fetchBlocks,
  fetchBlockTransactions,
  stopUpdating,
  updateBlocks,
} from '.';

jest.mock('ethers');

const getBlockNumber = jest.fn();
const getBlock = jest.fn();
const getBlockWithTransactions = jest.fn();
const on = jest.fn();
const off = jest.fn();
const Provider = jest.fn();
Provider.prototype.getBlockNumber = getBlockNumber;
Provider.prototype.getBlock = getBlock;
Provider.prototype.getBlockWithTransactions = getBlockWithTransactions;
Provider.prototype.on = on;
Provider.prototype.off = off;

ethers.providers.Web3Provider = Provider;

describe.only('API', () => {
  it('function fetchBlocks returns as expected', async () => {
    getBlockNumber.mockResolvedValue(10);
    getBlock.mockImplementation((i) => Promise.resolve(i));

    const output = await fetchBlocks();
    const blocks = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

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

    await waitFor(() => {
      expect(getBlockWithTransactions).toHaveBeenCalledTimes(1);
      expect(output).toStrictEqual(1);
    });
  });

  it('function updateBlock subscribes to event as expected', async () => {
    updateBlocks();
    const mockEventCallback = expect.any(Function);
    expect(on).toHaveBeenCalledTimes(1);
    expect(on).toHaveBeenCalledWith('block', mockEventCallback);
  });

  it('function stopUpdate unsubscribes to event as expected', async () => {
    stopUpdating(new ethers.providers.Web3Provider());
    expect(off).toHaveBeenCalledTimes(1);
  });
});
