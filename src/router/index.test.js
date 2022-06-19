import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import Router from '.';

describe.only('Router Component', () => {
  it('renders blocks component', () => {
    const { getByText } = render(<Router />);
    expect(getByText('Blocks')).toBeInTheDocument();
  });

  it('matches snapshot', async () => {
    const tree = render(<Router />);
    expect(tree).toMatchSnapshot();
  });
});
