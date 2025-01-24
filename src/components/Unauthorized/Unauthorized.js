// src/components/Unauthorized/Unauthorized.js
import { useLocation } from 'react-router-dom';

export default function Unauthorized() {
  const location = useLocation();
  return (
    <div className="unauthorized">
      <h1>⚠️ Access Denied</h1>
      <p>{location.state?.error || 'You do not have permission to view this page'}</p>
    </div>
  );
}