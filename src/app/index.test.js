import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import App from '.';

describe.only('App Component', () => {
  it('displays the header', () => {
    const { getByText } = render(<App />);
    expect(getByText('Ethereum App')).toBeInTheDocument();
  });

  it('matches snapshot', async () => {
    const tree = render(<App />);
    expect(tree).toMatchSnapshot();
  });
});
