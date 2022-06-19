import React from 'react';
import { useParams } from 'react-router-dom';
import '@testing-library/jest-dom';
import { render, waitFor } from '@testing-library/react';
import { fetchBlockTransactions } from '../../api';
import BlockTransactions from '.';

jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
}));

jest.mock('../../api', () => ({
  fetchBlockTransactions: jest.fn(),
}));

const renderBlockTransactions = () => {
  const transactions = [
    {
      hash: '0x395950bd3b8e',
      gasLimit: { _hex: '0x01ca35d2' },
      gasPrice: { _hex: '0x12564a62b2' },
      nonce: 12345,
      from: '0xA7EFAe72',
      to: '0xDd52Db7e',
      value: { _hex: '0x00' },
    },
    {
      hash: '0x5182e0cd0bd8',
      gasLimit: { _hex: '0x01ba35e2' },
      gasPrice: { _hex: '0x12564b62a2' },
      nonce: 23456,
      from: '0xAe45a8240',
      to: '0x7fA4737Ea',
      value: { _hex: '0x277df16f52c000' },
    },
  ];
  useParams.mockReturnValue({ blockNumber: 123 });
  fetchBlockTransactions.mockReturnValue(Promise.resolve({ transactions }));

  const renderedBlockTransactions = render(<BlockTransactions />);
  return renderedBlockTransactions;
};

describe.only('BlockTransactions Component', () => {
  it('displays the header', async () => {
    useParams.mockReturnValue({ blockNumber: 123 });
    const { getByText } = render(<BlockTransactions />);
    expect(useParams).toHaveBeenCalled();
    expect(getByText('Transactions of Block 123')).toBeInTheDocument();
  });

  it('renders loading state', () => {
    useParams.mockReturnValue({ blockNumber: 123 });
    const { getByText } = render(<BlockTransactions />);
    expect(useParams).toHaveBeenCalled();
    expect(getByText('Loading...')).toBeInTheDocument();
  });

  it('renders error state', async () => {
    useParams.mockReturnValue({ blockNumber: 123 });
    fetchBlockTransactions.mockReturnValue(
      Promise.reject(new Error('Something went wrong!'))
    );
    const { queryByText } = render(<BlockTransactions />);
    expect(fetchBlockTransactions).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(queryByText('Loading...')).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(queryByText('Error: Something went wrong!')).toBeInTheDocument();
    });
  });

  it('matches loading snapshot', async () => {
    const tree = renderBlockTransactions();
    expect(tree).toMatchSnapshot();
  });

  it('matches error snapshot', async () => {
    useParams.mockReturnValue({ blockNumber: '123' });
    fetchBlockTransactions.mockReturnValue(
      Promise.reject(new Error('Something went wrong!'))
    );
    const tree = render(<BlockTransactions />);
    await waitFor(() => {
      expect(tree.queryByText('Loading...')).not.toBeInTheDocument();
    });
    expect(tree).toMatchSnapshot();
  });

  it('only render transactions with value', async () => {
    const tree = renderBlockTransactions();
    const { queryByText } = tree;
    await waitFor(() => {
      expect(fetchBlockTransactions).toHaveBeenCalledTimes(1);
    });
    await waitFor(() => {
      expect(queryByText('Loading...')).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(queryByText('0x395950bd3b8e')).not.toBeInTheDocument();
      expect(queryByText('0x5182e0cd0bd8')).toBeInTheDocument();
    });
  });

  it('matches rendered snapshot', async () => {
    const tree = renderBlockTransactions();
    await waitFor(() => {
      expect(tree.queryByText('Loading...')).not.toBeInTheDocument();
    });
    expect(tree).toMatchSnapshot();
  });
});
