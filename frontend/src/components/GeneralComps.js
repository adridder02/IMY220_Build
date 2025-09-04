import React from 'react';

export const Search = ({ value, onChange }) => {
  return (
    <div className="filterSearch">
      <input
        type="text"
        placeholder="Search activities..."
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export const Sort = ({ value, onChange }) => {
  return (
    <div className="sort">
      <select value={value} onChange={onChange}>
        <option value="date-desc">Date (Newest First)</option>
        <option value="date-asc">Date (Oldest First)</option>
        <option value="name-asc">Name (A-Z)</option>
        <option value="name-desc">Name (Z-A)</option>
      </select>
    </div>
  );
};