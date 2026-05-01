import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { MoodSlider } from '../MoodSlider';

describe('MoodSlider', () => {
  it('renders correctly with null value', () => {
    const { getByTestId, getByText } = render(<MoodSlider value={null} onValueChange={() => {}} />);
    
    expect(getByTestId('mood-slider-container')).toBeTruthy();
    expect(getByText('❓')).toBeTruthy();
  });

  it('renders correctly with a selected value', () => {
    const { getByText, getAllByText } = render(<MoodSlider value={7} onValueChange={() => {}} />);
    
    expect(getByText('😊')).toBeTruthy();
    // 7 appears exactly once in the graduation points
    expect(getAllByText('7').length).toBe(1);
  });

  it('configures the slider component correctly', () => {
    const { getByTestId } = render(<MoodSlider value={5} onValueChange={() => {}} />);
    const slider = getByTestId('mood-slider');

    expect(slider.props.minimumValue).toBe(1);
    expect(slider.props.maximumValue).toBe(10);
    expect(slider.props.step).toBe(1);
    expect(slider.props.value).toBe(5);
  });

  it('uses fallback value for slider when null', () => {
    const { getByTestId } = render(<MoodSlider value={null} onValueChange={() => {}} />);
    const slider = getByTestId('mood-slider');

    expect(slider.props.value).toBe(5);
  });

  it('renders graduation points 1-10', () => {
    const { getByText } = render(<MoodSlider value={null} onValueChange={() => {}} />);
    for (let i = 1; i <= 10; i++) {
      expect(getByText(i.toString())).toBeTruthy();
    }
  });

  it('calls onValueChange when slider value changes', () => {
    const onValueChange = jest.fn();
    const { getByTestId } = render(<MoodSlider value={5} onValueChange={onValueChange} />);
    
    const slider = getByTestId('mood-slider');
    fireEvent(slider, 'onValueChange', 8);
    
    expect(onValueChange).toHaveBeenCalledWith(8);
  });
});
