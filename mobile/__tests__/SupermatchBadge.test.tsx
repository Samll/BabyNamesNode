import React from 'react';
import { render } from '@testing-library/react-native';
import SupermatchBadge from '../src/components/SupermatchBadge';

describe('SupermatchBadge', () => {
  it('renders remaining count when provided', () => {
    const { getByText } = render(<SupermatchBadge remaining={2} />);
    expect(getByText('Supermatch')).toBeTruthy();
    expect(getByText('2')).toBeTruthy();
  });

  it('applies inactive styling when disabled', () => {
    const { getByText } = render(<SupermatchBadge active={false} />);
    const label = getByText('Supermatch');
    const style = label.parent?.props.style;
    const styleArray = Array.isArray(style) ? style : style ? [style] : [];
    expect(styleArray).toEqual(
      expect.arrayContaining([expect.objectContaining({ backgroundColor: '#6b7280' })])
    );
  });
});
