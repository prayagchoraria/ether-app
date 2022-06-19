import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Blocks from '../pages/blocks';

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Blocks />} />
      </Routes>
    </BrowserRouter>
  );
}
