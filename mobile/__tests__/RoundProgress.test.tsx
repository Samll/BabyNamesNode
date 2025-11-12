import React from 'react';
import { render } from '@testing-library/react-native';
import RoundProgress from '../src/components/RoundProgress';

describe('RoundProgress', () => {
  it('renders current and total values', () => {
    const { getByText } = render(<RoundProgress current={3} total={10} />);
    expect(getByText('3 of 10 names reviewed')).toBeTruthy();
  });
});
