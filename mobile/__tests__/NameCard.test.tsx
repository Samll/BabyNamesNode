import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import NameCard from '../src/components/NameCard';
import { BabyName } from '../src/types';

describe('NameCard', () => {
  const baseName: BabyName = {
    id: '1',
    name: 'Avery',
    gender: 'unisex'
  };

  it('renders the baby name and metadata', () => {
    const { getByText } = render(
      <NameCard name={{ ...baseName, meaning: 'Elf ruler', origin: 'English' }} />
    );

    expect(getByText('Avery')).toBeTruthy();
    expect(getByText('Elf ruler')).toBeTruthy();
    expect(getByText('Origin: English')).toBeTruthy();
  });

  it('triggers actions when buttons are pressed', () => {
    const onLike = jest.fn();
    const onDislike = jest.fn();

    const { getByText } = render(
      <NameCard name={baseName} onLike={onLike} onDislike={onDislike} />
    );

    fireEvent.press(getByText('Like'));
    fireEvent.press(getByText('Skip'));

    expect(onLike).toHaveBeenCalled();
    expect(onDislike).toHaveBeenCalled();
  });
});
