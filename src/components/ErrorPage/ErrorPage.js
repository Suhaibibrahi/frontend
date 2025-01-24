// src/components/ErrorPage/ErrorPage.js
import { useLocation } from 'react-router-dom';

export default function ErrorPage() {
  const location = useLocation();
  return (
    <div className="error-page">
      <h1>Oops! Something went wrong</h1>
      <p>{location.state?.error || 'Unknown error occurred'}</p>
    </div>
  );
}