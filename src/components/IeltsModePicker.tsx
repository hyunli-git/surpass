// src/components/IeltsModePicker.tsx

"use client";

import { useState } from 'react';

// 이 컴포넌트가 어떤 props를 받을지 정의합니다.
interface IeltsModePickerProps {
  onConfirm: (mode: 'normal' | 'test') => void;
  onCancel: () => void;
}

export default function IeltsModePicker({ onConfirm, onCancel }: IeltsModePickerProps) {
  const [selectedMode, setSelectedMode] = useState<'normal' | 'test'>('normal');

  return (
    <div style={styles.overlay}>
      <div style={styles.sheet}>
        <h2>Choose Mode</h2>
        <p>Select how you want to run this session.</p>
        <div style={styles.rows}>
          <label style={styles.row} onClick={() => setSelectedMode('normal')}>
            <input type="radio" name="ielts-mode-choice" value="normal" checked={selectedMode === 'normal'} readOnly />
            <div>
              <strong>Normal</strong><br />
              <span>Use your original UI and flow.</span>
            </div>
          </label>
          <label style={styles.row} onClick={() => setSelectedMode('test')}>
            <input type="radio" name="ielts-mode-choice" value="test" checked={selectedMode === 'test'} readOnly />
            <div>
              <strong>Test UI</strong><br />
              <span>IELTS-style restrictions and layout.</span>
            </div>
          </label>
        </div>
        <div style={styles.actions}>
          <button onClick={onCancel} className="btn">Cancel</button>
          <button onClick={() => onConfirm(selectedMode)} className="btn btn-primary">Start</button>
        </div>
      </div>
    </div>
  );
}

// 간단한 스타일 객체 (CSS 파일 대신 사용)
const styles: { [key: string]: React.CSSProperties } = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', zIndex: 999 },
  sheet: { maxWidth: '560px', margin: '10vh auto', background: '#fff', borderRadius: '16px', padding: '22px', boxShadow: '0 24px 64px rgba(0,0,0,.35)' },
  rows: { display: 'grid', gap: '10px', margin: '12px 0 4px' },
  row: { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: '12px', cursor: 'pointer' },
  actions: { display: 'flex', gap: '10px', justifyContent: 'flex-end', margin: '14px 0 0' }
};