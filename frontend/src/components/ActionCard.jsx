import React from 'react';
import '../styles/Components.css';

const ActionCard = ({ title, icon, onClick }) => {
  return (
    <button className="action-card" onClick={onClick}>
      <div className="action-card-icon">{icon}</div>
      <span className="action-card-title">{title}</span>
    </button>
  );
};

export default ActionCard;