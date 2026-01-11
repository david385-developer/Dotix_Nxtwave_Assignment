import { useToast } from '../contexts/ToastContext';
import Toast from './Toast';

export default function ToastContainer() {
  const { toasts, dismissToast } = useToast();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      className="
        fixed top-4 right-4 sm:top-6 sm:right-6 z-50
        flex flex-col gap-3
        pointer-events-none
        max-w-[calc(100vw-2rem)] sm:max-w-none
      "
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto"
        >
          <Toast
            id={toast.id}
            message={toast.message}
            variant={toast.variant}
            duration={toast.duration}
            onDismiss={dismissToast}
          />
        </div>
      ))}
    </div>
  );
}
