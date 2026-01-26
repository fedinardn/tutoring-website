'use client';

declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void;
    };
  }
}

interface CalendlyButtonProps {
  className?: string;
  children: React.ReactNode;
}

export default function CalendlyButton({ className, children }: CalendlyButtonProps) {
  const openCalendly = () => {
    if (window.Calendly) {
      window.Calendly.initPopupWidget({
        url: 'https://calendly.com/justemacademy/trial-session?text_color=00273d&primary_color=e4b118',
      });
    }
  };

  return (
    <button onClick={openCalendly} className={className}>
      {children}
    </button>
  );
}
