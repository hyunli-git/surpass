import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Page from '@/app/ielts-general-practice/page';

// Mock router navigation used by the page
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

// Provide a default supabase mock where a user exists to open the modal
vi.mock('@/utils/supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: async () => ({ data: { session: { user: { id: 'u1', email: 'test@example.com' } } }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
  },
}));

describe('IELTS General Training page', () => {
  it('renders key sections', () => {
    render(<Page />);
    expect(screen.getByRole('heading', { name: /IELTS General Training/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /General Training Mock Tests/i })).toBeInTheDocument();
  });

  it('opens mode picker modal when starting a mock test (logged in)', async () => {
    render(<Page />);
    fireEvent.click(screen.getByRole('button', { name: /Start Full Test/i }));
    await waitFor(() => expect(screen.getByText('Choose Mode')).toBeInTheDocument());
  });
});

