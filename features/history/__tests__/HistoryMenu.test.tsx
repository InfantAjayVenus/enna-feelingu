import React, { createRef } from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { HistoryMenu, MenuAction } from '../HistoryMenu';
import { View } from 'react-native';

describe('HistoryMenu', () => {
  const mockOnClose = jest.fn();
  const mockAction1Press = jest.fn();
  const mockAction2Press = jest.fn();

  const actions: MenuAction[] = [
    {
      id: 'action-1',
      label: 'Action 1',
      iconName: 'chevron.up.circle',
      onPress: mockAction1Press,
    },
    {
      id: 'action-2',
      label: 'Action 2',
      iconName: 'chevron.down.circle',
      onPress: mockAction2Press,
    },
  ];

  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders correctly when visible', () => {
    const anchorRef = createRef<View>();
    const { getByText } = render(
      <HistoryMenu
        visible={true}
        onClose={mockOnClose}
        actions={actions}
        anchorRef={anchorRef}
      />
    );

    expect(getByText('Action 1')).toBeTruthy();
    expect(getByText('Action 2')).toBeTruthy();
  });

  it('calls onClose when background is pressed', () => {
    const anchorRef = createRef<View>();
    const { getByTestId } = render(
      <HistoryMenu
        visible={true}
        onClose={mockOnClose}
        actions={actions}
        anchorRef={anchorRef}
      />
    );

    const modal = getByTestId('history-menu-modal');
    fireEvent(modal, 'requestClose');
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('triggers action onPress after timeout', () => {
    const anchorRef = createRef<View>();
    const { getByLabelText } = render(
      <HistoryMenu
        visible={true}
        onClose={mockOnClose}
        actions={actions}
        anchorRef={anchorRef}
      />
    );

    const action1Button = getByLabelText('Action 1');
    fireEvent.press(action1Button);

    // Should not be called immediately due to setTimeout
    expect(mockAction1Press).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(120);
    });

    expect(mockAction1Press).toHaveBeenCalledTimes(1);
  });
});
