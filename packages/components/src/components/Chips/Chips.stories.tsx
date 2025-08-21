// src/components/Chips/Chip.stories.tsx
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import  Chip  from './';
import { fn } from 'storybook/test';

const meta = {
  title: 'Example/Chip',
  component: Chip,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    state: {
      control: { type: 'select' },
      options: ['enabled', 'hovered', 'focused', 'pressed', 'dragged', 'disabled'],
    },
    type: {
      control: { type: 'select' },
      options: ['assist', 'filter', 'input', 'suggestion'],
    },
    onClick: { action: 'clicked' },
    onDelete: { action: 'deleted' },
  },
  args: {
    label: 'Default Chip',
    onClick: fn(),
    onDelete: fn(),
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof Chip>;

// --- Stories ---

export const Assist: Story = {
  args: {
    label: 'Assist',
    type: 'assist',
    leadingIcon: <span role="img" aria-label="calendar">📅</span>,
  },
};

export const Filter: Story = {
  args: {
    label: 'Filter',
    type: 'filter',
    selected: true,
    leadingIcon: <span role="img" aria-label="check">✔️</span>,
  },
};

export const Input: Story = {
  args: {
    label: 'Input',
    type: 'input',
    onDelete: () => alert('Input Chip deleted'),
  },
};

export const Suggestion: Story = {
  args: {
    label: 'Suggestion',
    type: 'suggestion',
  },
};
