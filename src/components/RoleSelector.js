import React from 'react';

const RoleSelector = ({ role, setRole }) => {
  return (
    <div className="role-selector">
      <label>Select Role:</label>
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="student">Student</option>
        <option value="admin">Admin</option>
      </select>
    </div>
  );
};

export default RoleSelector;