import React from 'react';

export const Sort = () => {
    return (
        <div className="sort">
            <div className="select-wrapper">
                <select>
                    <option value="name-asc">Sort by Name (A-Z)</option>
                    <option value="name-desc">Sort by Name (Z-A)</option>
                    <option value="date-asc">Sort by Date (Low to High)</option>
                    <option value="date-desc">Sort by Date (High to Low)</option>
                </select>
            </div>
        </div>
    );
};

export const FilterSearch = ({ value, onChange }) => {
  return (
    <div id="filterSearch">
      <input
        type="text"
        placeholder="Search for Project..."
        value={value}
        onChange={onChange}
      />
    </div>
  );
};
