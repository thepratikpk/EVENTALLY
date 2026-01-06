// components/ToasterProvider.jsx
import React from 'react';
import { Toaster } from 'react-hot-toast';

const ToasterProvider = () => {
  return (
    <Toaster
      position="top-right"
      gutter={12}
      toastOptions={{
        success: {
          style: {
            background: '#ffffff',
            color: '#0f172a',
            border: '1px solid #e2e8f0',
            borderLeft: '4px solid #10b981',
            borderRadius: '8px',
            padding: '16px 20px',
            fontWeight: '500',
            fontSize: '14px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            maxWidth: '400px',
          },
          iconTheme: {
            primary: '#10b981',
            secondary: '#ffffff',
          },
          duration: 5000,
        },
        error: {
          style: {
            background: '#ffffff',
            color: '#0f172a',
            border: '1px solid #e2e8f0',
            borderLeft: '4px solid #ef4444',
            borderRadius: '8px',
            padding: '16px 20px',
            fontWeight: '500',
            fontSize: '14px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            maxWidth: '400px',
          },
          iconTheme: {
            primary: '#ef4444',
            secondary: '#ffffff',
          },
          duration: 6000,
        },
        loading: {
          style: {
            background: '#ffffff',
            color: '#0f172a',
            border: '1px solid #e2e8f0',
            borderLeft: '4px solid #3b82f6',
            borderRadius: '8px',
            padding: '16px 20px',
            fontWeight: '500',
            fontSize: '14px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            maxWidth: '400px',
          },
          iconTheme: {
            primary: '#3b82f6',
            secondary: '#ffffff',
          },
        },
        blank: {
          style: {
            background: '#ffffff',
            color: '#0f172a',
            border: '1px solid #e2e8f0',
            borderLeft: '4px solid #64748b',
            borderRadius: '8px',
            padding: '16px 20px',
            fontWeight: '500',
            fontSize: '14px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            maxWidth: '400px',
          },
          duration: 4000,
        },
        style: {
          background: '#ffffff',
          color: '#0f172a',
          fontSize: '14px',
          fontWeight: '500',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          maxWidth: '400px',
          padding: '16px 20px',
        },
      }}
    />
  );
};

export default ToasterProvider;
