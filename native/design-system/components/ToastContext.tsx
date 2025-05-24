import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { Toast, ToastType } from './Toast';

interface ToastContextProps {
  showToast: (message: string, type?: ToastType, position?: 'top' | 'bottom') => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<ToastType>('info');
  const [position, setPosition] = useState<'top' | 'bottom'>('top');

  const showToast = useCallback(
    (newMessage: string, newType: ToastType = 'info', newPosition: 'top' | 'bottom' = 'top') => {
      setMessage(newMessage);
      setType(newType);
      setPosition(newPosition);
      setVisible(true);
    },
    [],
  );

  const hideToast = useCallback(() => {
    setVisible(false);
  }, []);

  const contextValue = useMemo(
    () => ({
      showToast,
      hideToast,
    }),
    [showToast, hideToast],
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <Toast
        visible={visible}
        message={message}
        type={type}
        position={position}
        onDismiss={hideToast}
      />
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextProps => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
