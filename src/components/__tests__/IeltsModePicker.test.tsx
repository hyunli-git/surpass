import { render, screen, fireEvent } from '@testing-library/react';
import IeltsModePicker from '@/components/IeltsModePicker';

describe('IeltsModePicker', () => {
  it('calls onCancel when Cancel is clicked', () => {
    const onCancel = vi.fn();
    const onConfirm = vi.fn();
    render(<IeltsModePicker onCancel={onCancel} onConfirm={onConfirm} />);

    fireEvent.click(screen.getByText('Cancel'));
    expect(onCancel).toHaveBeenCalled();
  });

  it('confirms selected mode', () => {
    const onCancel = vi.fn();
    const onConfirm = vi.fn();
    render(<IeltsModePicker onCancel={onCancel} onConfirm={onConfirm} />);

    // Default is 'Normal'
    fireEvent.click(screen.getByText('Start'));
    expect(onConfirm).toHaveBeenCalledWith('normal');

    // Switch to Test UI and confirm
    fireEvent.click(screen.getByText('Test UI'));
    fireEvent.click(screen.getByText('Start'));
    expect(onConfirm).toHaveBeenLastCalledWith('test');
  });
});

