import React, { useEffect, useState } from 'react';

const ScreenSizeDetector = () => {
  const [screenSize, setScreenSize] = useState('');

  const handleResize = () => {
    const currentScreenSize =
      window.innerWidth >= 1400 ? 'xxl' :
        window.innerWidth >= 1200 ? 'xl' :
          window.innerWidth >= 992 ? 'lg' :
            window.innerWidth >= 768 ? 'md' :
              window.innerWidth >= 576 ? 'sm' :
                'xs';

    setScreenSize(currentScreenSize);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="position-fixed bottom-0 end-0 bg-dark text-white">
      <h3 className="mb-0 p-2">Screen Size: <span className="text-primary">{screenSize}</span></h3>
    </div>
  );
};

export default ScreenSizeDetector;