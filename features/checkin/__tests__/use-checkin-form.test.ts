import { renderHook, act } from '@testing-library/react-native';
import { useCheckinForm } from '../use-checkin-form';
import { saveEntry } from '@/store';

jest.mock('@/store', () => ({
  saveEntry: jest.fn(),
}));

describe('useCheckinForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with default values', () => {
    const { result } = renderHook(() => useCheckinForm());

    expect(result.current.mood).toBeNull();
    expect(result.current.activity).toBe('');
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.isValid).toBe(false);
  });

  it('updates mood and activity', () => {
    const { result } = renderHook(() => useCheckinForm());

    act(() => {
      result.current.setMood(7);
      result.current.setActivity('Working on tests');
    });

    expect(result.current.mood).toBe(7);
    expect(result.current.activity).toBe('Working on tests');
    expect(result.current.isValid).toBe(true);
  });

  it('does not submit if mood is null', async () => {
    const { result } = renderHook(() => useCheckinForm());

    await act(async () => {
      const success = await result.current.submit();
      expect(success).toBeUndefined();
    });

    expect(saveEntry).not.toHaveBeenCalled();
  });

  it('submits successfully when mood is set', async () => {
    const { result } = renderHook(() => useCheckinForm());

    act(() => {
      result.current.setMood(8);
      result.current.setActivity('Coding');
    });

    let success;
    await act(async () => {
      success = await result.current.submit();
    });

    expect(success).toBe(true);
    expect(saveEntry).toHaveBeenCalledWith(
      expect.objectContaining({
        mood: 8,
        activity: 'Coding',
        skipped: false,
        autoSkipped: false,
        overriddenByEntryId: null,
      })
    );
    
    // Assert UUID format
    const callArgs = (saveEntry as jest.Mock).mock.calls[0][0];
    expect(callArgs.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    
    // Assert timestamp format (YYYY-MM-DDTHH:mm:00)
    expect(callArgs.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:00$/);
  });

  it('handles submission errors', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const error = new Error('Database failure');
    (saveEntry as jest.Mock).mockRejectedValueOnce(error);
    
    const { result } = renderHook(() => useCheckinForm());

    act(() => {
      result.current.setMood(5);
    });

    await expect(act(async () => {
      await result.current.submit();
    })).rejects.toThrow('Database failure');

    expect(result.current.isSubmitting).toBe(false);
    consoleSpy.mockRestore();
  });

  it('toggles isSubmitting during submission', async () => {
    // Delay saveEntry to check isSubmitting state
    let resolveSave: (value: void | PromiseLike<void>) => void;
    const savePromise = new Promise<void>((resolve) => {
      resolveSave = resolve;
    });
    (saveEntry as jest.Mock).mockReturnValue(savePromise);

    const { result } = renderHook(() => useCheckinForm());

    act(() => {
      result.current.setMood(5);
    });

    let submitPromise: Promise<boolean | undefined>;
    act(() => {
      submitPromise = result.current.submit();
    });

    expect(result.current.isSubmitting).toBe(true);

    await act(async () => {
      resolveSave!();
      await submitPromise!;
    });

    expect(result.current.isSubmitting).toBe(false);
  });
});
