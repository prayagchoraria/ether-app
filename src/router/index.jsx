import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Blocks from '../pages/blocks';
import BlockTransactions from '../pages/block-transactions';

export default function Router() {
  return (
    <BrowserRouter>
      <h1>
        <Link to="/">Ethereum App</Link>
      </h1>
      <Routes>
        <Route path="/" element={<Blocks />} />
        <Route path="/:blockNumber" element={<BlockTransactions />} />
      </Routes>
    </BrowserRouter>
  );
}
