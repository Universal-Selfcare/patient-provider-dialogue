import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/styles.css';

const Submitted: React.FC = () => {
  return (
    <div className="left-column" style={{ padding: '2rem' }}>
      <h2>Suggestions Submitted</h2>
      <Link to="/">
        <button>Return to Chart</button>
      </Link>
    </div>
  );
};

export default Submitted;
