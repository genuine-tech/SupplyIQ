import React, { useEffect } from 'react';

const Landing = () => {
  useEffect(() => {
    window.location.replace('/landing.html');
  }, []);

  return null;
};

export default Landing;
