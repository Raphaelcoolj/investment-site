import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from '@/components/Sidebar';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/dashboard',
}));

describe('Sidebar Component', () => {
    const mockOnClose = jest.fn();

    it('should be hidden on mobile by default', () => {
        render(<Sidebar isOpen={false} onClose={mockOnClose} />);
        const aside = screen.getByRole('complementary');
        expect(aside).toHaveClass('-translate-x-full');
    });

    it('should be visible on mobile when isOpen is true', () => {
        render(<Sidebar isOpen={true} onClose={mockOnClose} />);
        const aside = screen.getByRole('complementary');
        expect(aside).toHaveClass('translate-x-0');
    });

    it('should call onClose when overlay is clicked', () => {
        render(<Sidebar isOpen={true} onClose={mockOnClose} />);
        const overlay = screen.getByRole('presentation', { hidden: true }); // Depending on how it's rendered
        // Since overlay doesn't have a role, we'll find it by className or just click it if it's the first div after the fragment
        const clickableOverlay = screen.getByTestId('sidebar-overlay');
        fireEvent.click(clickableOverlay);
        expect(mockOnClose).toHaveBeenCalled();
    });
});
