import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { memo } from 'react';

/**
 * A debug component to add to routes for debugging - optimized with memo
 */
export const RouteDebugger = memo(function RouteDebugger() {
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();
  const { user, role, isLoading, error } = useAuth();

  // In Vite, we use import.meta.env instead of process.env
  // Don't render in production or if debug flag is not set
  if (import.meta.env.PROD || !import.meta.env.VITE_DEBUG_ROUTES) {
    return null;
  }
  
  // Prepare params display string
  const paramsDisplay = JSON.stringify(params) || 'none';

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        padding: '10px',
        background: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        fontSize: '12px',
        fontFamily: 'monospace',
        maxWidth: '400px',
        maxHeight: '200px',
        overflow: 'auto',
        zIndex: 9999,
        borderRadius: '4px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
      }}
    >
      <h4 style={{ margin: '0 0 5px', fontSize: '14px' }}>Route Debugger</h4>
      <div style={{ marginBottom: '5px' }}>
        <strong>Path:</strong> {location.pathname}
      </div>
      <div style={{ marginBottom: '5px' }}>
        <strong>Search:</strong> {location.search || 'none'}
      </div>
      <div style={{ marginBottom: '5px' }}>
        <strong>Params:</strong> {paramsDisplay}
      </div>
      <div style={{ marginBottom: '5px' }}>
        <strong>Auth:</strong> {user ? 'Authenticated' : 'Not Authenticated'}
      </div>
      <div style={{ marginBottom: '5px' }}>
        <strong>Role:</strong> {role || 'none'}
      </div>
      <div style={{ marginBottom: '5px' }}>
        <strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}
      </div>
      {error && (
        <div style={{ marginBottom: '5px', color: '#ff6b6b' }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      <div style={{ marginTop: '10px' }}>
        <button 
          onClick={() => navigate(-1)} 
          style={{ 
            background: '#4361ee', 
            border: 'none', 
            color: 'white', 
            padding: '3px 8px', 
            borderRadius: '3px',
            marginRight: '5px',
            cursor: 'pointer',
            fontSize: '10px'
          }}
        >
          Back
        </button>
        <button 
          onClick={() => navigate('/')} 
          style={{ 
            background: '#4361ee', 
            border: 'none', 
            color: 'white', 
            padding: '3px 8px', 
            borderRadius: '3px',
            cursor: 'pointer',
            fontSize: '10px'
          }}
        >
          Home
        </button>
      </div>
    </div>
  );
});
