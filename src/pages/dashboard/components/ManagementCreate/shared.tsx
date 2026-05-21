import React from 'react';
import { Button } from 'antd';

export const fieldStyle = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8,
  color: '#f1f5f9',
};

export const formLabel = (text: string) => (
  <span style={{ color: '#94a3b8', fontSize: 12 }}>{text}</span>
);

export const numberFormatter = (value?: number | string | null) => {
  if (value === undefined || value === null || value === '') {
    return '';
  }

  return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export const numberParser = (value?: string) => {
  if (!value) {
    return 0;
  }

  return Number(value.replace(/\./g, '').replace(/,/g, '.'));
};

export const numberFieldProps = {
  formatter: numberFormatter,
  parser: numberParser,
};

type ModalFooterProps = {
  cancelText: string;
  submitText: string;
  onCancel: () => void;
  onSubmit: () => void;
};

export const renderModalFooter = ({
  cancelText,
  submitText,
  onCancel,
  onSubmit,
}: ModalFooterProps) => (
  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
    <Button className="btn-ghost" onClick={onCancel}>
      {cancelText}
    </Button>
    <Button className="btn-primary" onClick={onSubmit}>
      {submitText}
    </Button>
  </div>
);
