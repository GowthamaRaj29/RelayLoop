import React from 'react';
import PropTypes from 'prop-types';

export const RiskBadge = ({ prediction, size, showPercentage }) => {
  if (!prediction) {
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 ${
        size === 'lg' ? 'px-3 py-1 text-sm' : ''
      }`}>
        <span className="mr-1">❓</span>
        <span>No Assessment</span>
      </span>
    );
  }
  
  const { risk_level, risk_percentage } = prediction;
  const colors = {
    low: 'bg-green-100 text-green-800 border-green-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
    high: 'bg-red-100 text-red-800 border-red-200'
  };
  
  const icons = {
    low: '✅',
    medium: '⚠️',
    high: '🚨'
  };
  
  const percentage = risk_percentage ? (risk_percentage * 100).toFixed(1) : null;
  
  return (
    <span className={`inline-flex items-center rounded-full font-medium border ${colors[risk_level] || colors.low} ${
      size === 'lg' ? 'px-3 py-1 text-sm' : 'px-2 py-1 text-xs'
    }`}>
      <span className="mr-1">{icons[risk_level] || '📊'}</span>
      <span>{risk_level?.toUpperCase()}</span>
      {showPercentage && percentage && (
        <span className="ml-1">({percentage}%)</span>
      )}
    </span>
  );
};

RiskBadge.propTypes = {
  prediction: PropTypes.shape({
    risk_level: PropTypes.string,
    risk_percentage: PropTypes.number,
  }),
  size: PropTypes.oneOf(['sm', 'lg']),
  showPercentage: PropTypes.bool,
};

RiskBadge.defaultProps = {
  prediction: null,
  size: 'sm',
  showPercentage: true,
};

export default RiskBadge;
