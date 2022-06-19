import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Blocks from '../pages/blocks';
import BlockTransactions from '../pages/block-transactions';

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Blocks />} />
        <Route path="/:blockNumber" element={<BlockTransactions />} />
      </Routes>
    </BrowserRouter>
  );
}
