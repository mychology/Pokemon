// src/components/StatBar.jsx
import React from 'react';
import styled from 'styled-components';

const BarWrap = styled.div`
  background: #e9e9e9;
  height: ${p => p.height || '12px'};
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(0,0,0,0.08);
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Fill = styled.div`
  height: 100%;
  border-radius: 6px;
  background: linear-gradient(90deg, #d43b2b, #ff5a4a);
  box-shadow: inset 0 -2px 4px rgba(0,0,0,0.12);
  transition: width 450ms ease;
`;

const ValueLabel = styled.div`
  font-size: 11px;
  min-width: 30px;
  text-align: right;
  color: #222;
`;

export default function StatBar({
  value = 0,
  max = 255,
  showValue = false,
  height = '12px',
}) {
  const safeMax = typeof max === 'number' && max > 0 ? max : 1;
  const safeValue = typeof value === 'number' && Number.isFinite(value) ? value : 0;
  const pct = Math.max(0, Math.min(100, (safeValue / safeMax) * 100));
  const widthStr = `${pct}%`;

  return (
    <BarWrap height={height} role="progressbar" aria-valuemin={0} aria-valuemax={safeMax} aria-valuenow={safeValue}>
      <div style={{ flex: 1 }}>
        <Fill style={{ width: widthStr }} />
      </div>
      {showValue && <ValueLabel>{safeValue}</ValueLabel>}
    </BarWrap>
  );
}
