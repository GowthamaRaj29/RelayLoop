export const getRiskColor = (riskLevel) => {
  const colors = {
    low: 'green',
    medium: 'yellow',
    high: 'red'
  };
  return colors[riskLevel] || 'gray';
};

export const getRiskIcon = (riskLevel) => {
  const icons = {
    low: '✅',
    medium: '⚠️',
    high: '🚨'
  };
  return icons[riskLevel] || '📊';
};

export const getRiskColorClasses = (riskLevel) => {
  const colorClasses = {
    low: 'bg-green-100 text-green-800 border-green-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
    high: 'bg-red-100 text-red-800 border-red-200'
  };
  return colorClasses[riskLevel] || colorClasses.low;
};

export const formatRiskPercentage = (riskPercentage) => {
  if (!riskPercentage) return null;
  return (riskPercentage * 100).toFixed(1);
};
