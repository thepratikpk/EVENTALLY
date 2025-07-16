// components/ToasterProvider.jsx
import React from 'react';
import { Toaster } from 'react-hot-toast';

const ToasterProvider = () => {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        success: {
          style: {
            background: '#e0f7fa',
            color: '#00796b',
            border: '1px solid #4dd0e1',
            borderRadius: '8px',
            padding: '12px 16px',
            fontWeight: '500'
          },
          iconTheme: {
            primary: '#00796b',
            secondary: '#b2dfdb',
          },
        },
        error: {
          style: {
            background: '#ffebee',
            color: '#c62828',
            border: '1px solid #ef9a9a',
            borderRadius: '8px',
            padding: '12px 16px',
            fontWeight: '500'
          },
          iconTheme: {
            primary: '#c62828',
            secondary: '#ffcdd2',
          },
        },
        duration: 4000,
        style: {
          fontSize: '14px',
          borderRadius: '10px',
        },
      }}
    />
  );
};

export default ToasterProvider;
