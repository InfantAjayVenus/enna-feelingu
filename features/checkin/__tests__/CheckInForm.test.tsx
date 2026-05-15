import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { CheckInForm } from '../CheckInForm';
import { saveEntry } from '@/store';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';

// Mock store
jest.mock('@/store', () => ({
  saveEntry: jest.fn(),
}));

// Mock router
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

describe('CheckInForm Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByTestId } = render(<CheckInForm />);
    expect(getByTestId('check-in-form')).toBeTruthy();
  });

  it('disables submit button by default', () => {
    const { getByTestId } = render(<CheckInForm />);
    const submitButton = getByTestId('submit-button');
    expect(submitButton.props.accessibilityState.disabled).toBe(true);
  });

  it('enables submit button when mood is selected', () => {
    const { getByTestId } = render(<CheckInForm />);

    const slider = getByTestId('mood-slider');
    fireEvent(slider, 'onValueChange', 7);

    const submitButton = getByTestId('submit-button');
    expect(submitButton.props.accessibilityState.disabled).toBe(false);
  });

  it('completes the full check-in flow', async () => {
    const onSuccess = jest.fn();
    const { getByTestId } = render(<CheckInForm onSuccess={onSuccess} />);

    // 1. Select mood
    const slider = getByTestId('mood-slider');
    fireEvent(slider, 'onValueChange', 9);

    // 2. Enter activity
    const activityInput = getByTestId('activity-input');
    fireEvent.changeText(activityInput, 'Building the future');

    // 3. Submit
    const submitButton = getByTestId('submit-button');

    await act(async () => {
      fireEvent.press(submitButton);
    });

    // 4. Verify saveEntry call
    expect(saveEntry).toHaveBeenCalledWith(
      expect.objectContaining({
        mood: 9,
        activity: 'Building the future',
      })
    );

    // 5. Verify toast
    expect(Toast.show).toHaveBeenCalledWith({
      type: 'success',
      text1: 'Success',
      text2: 'Check-in saved successfully!',
    });

    // 6. Verify onSuccess called
    expect(onSuccess).toHaveBeenCalled();
    expect(router.push).not.toHaveBeenCalled();
  });

  it('shows submitting state during save', async () => {
    // Delay saveEntry
    let resolveSave: (value: void | PromiseLike<void>) => void;
    const savePromise = new Promise<void>((resolve) => {
      resolveSave = resolve;
    });
    (saveEntry as jest.Mock).mockReturnValue(savePromise);

    const onSuccess = jest.fn();
    const { getByTestId, getByText } = render(<CheckInForm onSuccess={onSuccess} />);

    fireEvent(getByTestId('mood-slider'), 'onValueChange', 5);

    await act(async () => {
      fireEvent.press(getByTestId('submit-button'));
    });

    expect(getByText('Saving...')).toBeTruthy();
    expect(getByTestId('submit-button').props.accessibilityState.disabled).toBe(true);

    await act(async () => {
      resolveSave!();
    });

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it('handles submission errors gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (saveEntry as jest.Mock).mockRejectedValueOnce(new Error('Save failed'));

    const { getByTestId, getByText } = render(<CheckInForm />);

    fireEvent(getByTestId('mood-slider'), 'onValueChange', 5);

    await act(async () => {
      fireEvent.press(getByTestId('submit-button'));
    });

    expect(saveEntry).toHaveBeenCalled();
    expect(getByText('Submit')).toBeTruthy(); // Reverts from 'Saving...'

    consoleSpy.mockRestore();
  });
});
