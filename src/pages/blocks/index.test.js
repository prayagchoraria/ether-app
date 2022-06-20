import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { render, waitFor } from '@testing-library/react';
import { fetchBlocks, updateBlocks } from '../../api';
import Blocks from '.';

jest.mock('../../api', () => ({
  fetchBlocks: jest.fn(),
  updateBlocks: jest.fn(),
  stopUpdating: jest.fn(),
}));

const renderBlocks = () => {
  const blocks = [
    {
      number: 12345,
      gasLimit: { _hex: '0x01ca35d2' },
      gasUsed: { _hex: '0x44f340' },
      timestamp: 1655473012,
      transactions: ['14', '2'],
    },
    {
      number: 12346,
      gasLimit: { _hex: '0x01ca35d2' },
      gasUsed: { _hex: '0x44f340' },
      timestamp: 1655473112,
      transactions: [],
    },
  ];
  fetchBlocks.mockReturnValue(
    Promise.all(blocks.map((block) => Promise.resolve(block)))
  );
  const renderedBlocks = render(
    <BrowserRouter>
      <Blocks />
    </BrowserRouter>
  );
  return renderedBlocks;
};

describe.only('Blocks Component', () => {
  it('displays the header', () => {
    const { getByText } = render(<Blocks />);
    expect(getByText('Blocks')).toBeInTheDocument();
  });

  it('renders loading state', () => {
    const { getByText } = render(<Blocks />);
    expect(getByText('Loading...')).toBeInTheDocument();
  });

  it('renders error state', async () => {
    fetchBlocks.mockReturnValue(
      Promise.reject(new Error('Something went wrong!'))
    );
    const { queryByText } = render(<Blocks />);
    expect(fetchBlocks).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(queryByText('Loading...')).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(
        queryByText('Error: Something went wrong! Please refresh.')
      ).toBeInTheDocument();
    });
  });

  it('renders blocks', async () => {
    const { queryByText } = renderBlocks();
    expect(fetchBlocks).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(queryByText('Loading...')).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(queryByText('12345')).toBeInTheDocument();
      expect(queryByText('12346')).toBeInTheDocument();
    });
  });

  it('matches loading snapshot', async () => {
    const tree = renderBlocks();
    expect(tree).toMatchSnapshot();
  });

  it('matches error snapshot', async () => {
    fetchBlocks.mockReturnValue(
      Promise.reject(new Error('Something went wrong!'))
    );
    const tree = render(<Blocks />);
    await waitFor(() => {
      expect(tree.queryByText('Loading...')).not.toBeInTheDocument();
    });
    expect(tree).toMatchSnapshot();
  });

  it('matches rendered snapshot', async () => {
    const tree = renderBlocks();
    await waitFor(() => {
      expect(tree.queryByText('Loading...')).not.toBeInTheDocument();
    });
    expect(tree).toMatchSnapshot();
  });

  it('updates blocks', async () => {
    const tree = renderBlocks();
    await waitFor(() => {
      expect(tree.queryByText('Loading...')).not.toBeInTheDocument();
      expect(updateBlocks).toHaveBeenCalledTimes(1);
      expect(updateBlocks).toHaveBeenCalledWith(expect.any(Function));
    });
  });
});
