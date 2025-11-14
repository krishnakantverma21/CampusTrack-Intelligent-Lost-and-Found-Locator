import React from 'react';

const PasswordStrengthMeter = ({ password }) => {
  const getStrength = () => {
    if (!password) return '';
    if (password.length < 6) return 'Weak';
    if (password.length < 8) return 'Fair';
    if (password.length < 10) return 'Good';
    return 'Strong';
  };

  const strength = getStrength();

  return (
    <div className={`strength ${strength.toLowerCase()}`}>
      Strength: {strength}
    </div>
  );
};

export default PasswordStrengthMeter;