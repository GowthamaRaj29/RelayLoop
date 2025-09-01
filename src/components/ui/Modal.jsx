import { useEffect } from 'react';
import PropTypes from 'prop-types';

export default function Modal({ open, onClose, title, children, size = 'xl' }) {
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') onClose?.();
    }
    if (open) {
      document.addEventListener('keydown', onKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const maxWidth = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-3xl',
    full: 'max-w-6xl',
  }[size] || 'max-w-3xl';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <button
        type="button"
        aria-label="Close"
        className="fixed inset-0 z-40 bg-black/40"
        onClick={onClose}
      />
      <div className="min-h-screen px-4 text-center relative z-50">
        <span className="inline-block h-screen align-middle" aria-hidden="true">&#8203;</span>
        <div className={`inline-block w-full ${maxWidth} p-6 my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl`}>
          {title && (
            <div className="mb-4">
              <h3 className="text-lg font-medium leading-6 text-gray-900">{title}</h3>
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}

Modal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  title: PropTypes.string,
  children: PropTypes.node,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', 'full'])
};
