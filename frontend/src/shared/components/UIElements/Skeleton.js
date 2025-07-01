import React from 'react';
import './Skeleton.css';

const Skeleton = ({ width, height, borderRadius, style, className }) => (
  <div
    className={`skeleton ${className || ''}`}
    style={{
      width,
      height,
      borderRadius,
      ...style
    }}
  />
);

export default Skeleton;
