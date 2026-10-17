import React from 'react';

const Landing = () => {
  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-[#040711] z-50">
      <iframe
        src="/landing.html"
        title="SupplyChainIQ 3D Control Center Landing"
        className="w-full h-full border-0 block"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          margin: 0,
          padding: 0,
          display: 'block',
        }}
      />
    </div>
  );
};

export default Landing;

