import React, { useEffect } from 'react';

const FinlyAssistant = () => {
  useEffect(() => {
    // Check if script is already added to prevent duplicates
    const scriptId = 'elevenlabs-widget-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = "https://unpkg.com/@elevenlabs/convai-widget-embed";
      script.async = true;
      script.type = "text/javascript";
      document.body.appendChild(script);
    }
  }, []);

  return (
    <>
      <style>{`
        elevenlabs-convai {
          position: fixed !important;
          z-index: 9999 !important;
          right: 24px !important;
          bottom: 110px !important; /* Above mobile navbar */
        }
        @media (min-width: 768px) {
          elevenlabs-convai {
            bottom: 24px !important; /* Normal bottom for desktop */
          }
        }
      `}</style>
      {/* @ts-ignore - custom web component */}
      <elevenlabs-convai agent-id={import.meta.env.VITE_ELEVENLABS_AGENT_ID}></elevenlabs-convai>
    </>
  );
};

export default FinlyAssistant;
