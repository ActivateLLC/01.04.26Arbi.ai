/**
 * Component Tests for ControlPanel
 *
 * Tests the main control interface for the arbitrage system:
 * - System activation/deactivation
 * - Daily spend limit configuration
 * - Risk tolerance slider
 * - Accessibility features (ARIA labels, keyboard navigation)
 * - Disabled state when system is active
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { ControlPanel } from '../ControlPanel';
import { SystemStatus } from '../../types';

describe('ControlPanel', () => {
  const defaultProps = {
    status: SystemStatus.IDLE,
    onToggleStatus: vi.fn(),
    dailySpend: 1000,
    setDailySpend: vi.fn(),
    riskTolerance: 50,
    setRiskTolerance: vi.fn(),
  };

  describe('Rendering', () => {
    it('should render all main sections', () => {
      render(<ControlPanel {...defaultProps} />);

      expect(screen.getByText(/Turn It On/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/daily spend limit/i)).toBeInTheDocument();
      expect(screen.getByRole('slider')).toBeInTheDocument();
    });

    it('should display current daily spend value', () => {
      render(<ControlPanel {...defaultProps} dailySpend={2500} />);

      expect(screen.getByText('$2,500')).toBeInTheDocument();
    });

    it('should display current risk tolerance percentage', () => {
      render(<ControlPanel {...defaultProps} riskTolerance={75} />);

      expect(screen.getByText('75%')).toBeInTheDocument();
    });

    it('should apply correct color coding to risk tolerance', () => {
      const { rerender } = render(<ControlPanel {...defaultProps} riskTolerance={30} />);
      let riskDisplay = screen.getByText('30%');
      expect(riskDisplay).toHaveClass('text-blue-400');

      rerender(<ControlPanel {...defaultProps} riskTolerance={60} />);
      riskDisplay = screen.getByText('60%');
      expect(riskDisplay).toHaveClass('text-yellow-400');

      rerender(<ControlPanel {...defaultProps} riskTolerance={85} />);
      riskDisplay = screen.getByText('85%');
      expect(riskDisplay).toHaveClass('text-red-400');
    });
  });

  describe('System Status Toggle', () => {
    it('should show ACTIVATE button when system is idle', () => {
      render(<ControlPanel {...defaultProps} status={SystemStatus.IDLE} />);

      const button = screen.getByRole('button', { name: /activate arbitrage system/i });
      expect(button).toHaveTextContent('ACTIVATE');
      expect(button).toHaveClass('bg-emerald-500');
    });

    it('should show DEACTIVATE button when system is active', () => {
      render(<ControlPanel {...defaultProps} status={SystemStatus.ACTIVE} />);

      const button = screen.getByRole('button', { name: /deactivate arbitrage system/i });
      expect(button).toHaveTextContent('DEACTIVATE');
      expect(button).toHaveClass('bg-red-500/10');
    });

    it('should call onToggleStatus when button is clicked', () => {
      const mockToggle = vi.fn();
      render(<ControlPanel {...defaultProps} onToggleStatus={mockToggle} />);

      const button = screen.getByRole('button', { name: /activate arbitrage system/i });
      fireEvent.click(button);

      expect(mockToggle).toHaveBeenCalledTimes(1);
    });

    it('should show active system indicator when running', () => {
      render(<ControlPanel {...defaultProps} status={SystemStatus.ACTIVE} />);

      expect(screen.getByText(/System Running/i)).toBeInTheDocument();
      expect(screen.getByText(/AI Autonomous Mode Engaged/i)).toBeInTheDocument();
    });

    it('should not show active indicator when system is idle', () => {
      render(<ControlPanel {...defaultProps} status={SystemStatus.IDLE} />);

      expect(screen.queryByText(/System Running/i)).not.toBeInTheDocument();
    });
  });

  describe('Daily Spend Input', () => {
    it('should render daily spend input with correct value', () => {
      render(<ControlPanel {...defaultProps} dailySpend={1500} />);

      const input = screen.getByLabelText(/daily spend limit/i) as HTMLInputElement;
      expect(input.value).toBe('1500');
      expect(input.type).toBe('number');
    });

    it('should call setDailySpend when value changes', () => {
      const mockSetDailySpend = vi.fn();
      render(<ControlPanel {...defaultProps} setDailySpend={mockSetDailySpend} />);

      const input = screen.getByLabelText(/daily spend limit/i);
      fireEvent.change(input, { target: { value: '3000' } });

      expect(mockSetDailySpend).toHaveBeenCalledWith(3000);
    });

    it('should be disabled when system is active', () => {
      render(<ControlPanel {...defaultProps} status={SystemStatus.ACTIVE} />);

      const input = screen.getByLabelText(/daily spend limit/i);
      expect(input).toBeDisabled();
    });

    it('should be enabled when system is idle', () => {
      render(<ControlPanel {...defaultProps} status={SystemStatus.IDLE} />);

      const input = screen.getByLabelText(/daily spend limit/i);
      expect(input).not.toBeDisabled();
    });
  });

  describe('Risk Tolerance Slider', () => {
    it('should render risk tolerance slider with correct value', () => {
      render(<ControlPanel {...defaultProps} riskTolerance={65} />);

      const slider = screen.getByRole('slider') as HTMLInputElement;
      expect(slider.value).toBe('65');
      expect(slider.min).toBe('1');
      expect(slider.max).toBe('100');
    });

    it('should call setRiskTolerance when value changes', () => {
      const mockSetRiskTolerance = vi.fn();
      render(<ControlPanel {...defaultProps} setRiskTolerance={mockSetRiskTolerance} />);

      const slider = screen.getByRole('slider');
      fireEvent.change(slider, { target: { value: '80' } });

      expect(mockSetRiskTolerance).toHaveBeenCalledWith(80);
    });

    it('should be disabled when system is active', () => {
      render(<ControlPanel {...defaultProps} status={SystemStatus.ACTIVE} />);

      const slider = screen.getByRole('slider');
      expect(slider).toBeDisabled();
    });

    it('should be enabled when system is idle', () => {
      render(<ControlPanel {...defaultProps} status={SystemStatus.IDLE} />);

      const slider = screen.getByRole('slider');
      expect(slider).not.toBeDisabled();
    });

    it('should show conservative and aggressive labels', () => {
      render(<ControlPanel {...defaultProps} />);

      expect(screen.getByText('Conservative')).toBeInTheDocument();
      expect(screen.getByText('Aggressive')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels for all interactive elements', () => {
      render(<ControlPanel {...defaultProps} />);

      expect(screen.getByLabelText(/daily spend limit in dollars/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /activate arbitrage system/i })).toBeInTheDocument();
    });

    it('should have proper aria-pressed state on toggle button', () => {
      const { rerender } = render(<ControlPanel {...defaultProps} status={SystemStatus.IDLE} />);
      let button = screen.getByRole('button', { name: /activate/i });
      expect(button).toHaveAttribute('aria-pressed', 'false');

      rerender(<ControlPanel {...defaultProps} status={SystemStatus.ACTIVE} />);
      button = screen.getByRole('button', { name: /deactivate/i });
      expect(button).toHaveAttribute('aria-pressed', 'true');
    });

    it('should have live region for daily spend display', () => {
      render(<ControlPanel {...defaultProps} dailySpend={5000} />);

      const liveRegion = screen.getByText('$5,000');
      expect(liveRegion).toHaveAttribute('aria-live', 'polite');
    });

    it('should have descriptive text for screen readers', () => {
      render(<ControlPanel {...defaultProps} />);

      expect(
        screen.getByText(/Set your daily spending limit/i, { selector: '.sr-only' })
      ).toBeInTheDocument();
    });
  });

  describe('Visual Styling', () => {
    it('should apply correct styling based on system status', () => {
      const { rerender } = render(<ControlPanel {...defaultProps} status={SystemStatus.IDLE} />);
      let button = screen.getByRole('button', { name: /activate/i });
      expect(button).toHaveClass('bg-emerald-500');

      rerender(<ControlPanel {...defaultProps} status={SystemStatus.ACTIVE} />);
      button = screen.getByRole('button', { name: /deactivate/i });
      expect(button).toHaveClass('bg-red-500/10');
    });

    it('should show numbered step indicators', () => {
      const { container } = render(<ControlPanel {...defaultProps} />);

      // Check for step numbers in the UI - they are aria-hidden decorative elements
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });
  });

  describe('Integration', () => {
    it('should handle multiple rapid clicks on toggle button', () => {
      const mockToggle = vi.fn();
      render(<ControlPanel {...defaultProps} onToggleStatus={mockToggle} />);

      const button = screen.getByRole('button', { name: /activate/i });
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      expect(mockToggle).toHaveBeenCalledTimes(3);
    });

    it('should handle extreme daily spend values', () => {
      const mockSetDailySpend = vi.fn();
      render(<ControlPanel {...defaultProps} setDailySpend={mockSetDailySpend} />);

      const input = screen.getByLabelText(/daily spend limit/i);

      fireEvent.change(input, { target: { value: '0' } });
      expect(mockSetDailySpend).toHaveBeenCalledWith(0);

      fireEvent.change(input, { target: { value: '999999' } });
      expect(mockSetDailySpend).toHaveBeenCalledWith(999999);
    });

    it('should handle boundary values for risk tolerance', () => {
      const mockSetRiskTolerance = vi.fn();
      render(<ControlPanel {...defaultProps} setRiskTolerance={mockSetRiskTolerance} />);

      const slider = screen.getByRole('slider');

      fireEvent.change(slider, { target: { value: '1' } });
      expect(mockSetRiskTolerance).toHaveBeenCalledWith(1);

      fireEvent.change(slider, { target: { value: '100' } });
      expect(mockSetRiskTolerance).toHaveBeenCalledWith(100);
    });
  });
});
