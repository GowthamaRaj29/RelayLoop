// PropTypes import
import PropTypes from 'prop-types';

// Component types
const IconComponentPropTypes = {
  name: PropTypes.string.isRequired,
  className: PropTypes.string
};

const StatCardPropTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  change: PropTypes.number,
  timeRange: PropTypes.string,
  icon: PropTypes.string
};

const ChartCardPropTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  description: PropTypes.string
};

const TableCardPropTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  ).isRequired
};

export { 
  IconComponentPropTypes,
  StatCardPropTypes,
  ChartCardPropTypes,
  TableCardPropTypes
};
