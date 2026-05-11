const UAEFlag = ({ className }) => {
  return (
    <svg
      viewBox="0 0 24 16"
      xmlns="http://www.w3.org/2000/svg"
      className={className || "w-6 h-4"}
      style={{ borderRadius: '2px', overflow: 'hidden', display: 'inline-block' }}
    >
      <rect x="6" y="0" width="18" height="5.33" fill="#00732f" />
      <rect x="6" y="5.33" width="18" height="5.34" fill="#ffffff" />
      <rect x="6" y="10.67" width="18" height="5.33" fill="#000000" />
      <rect x="0" y="0" width="6" height="16" fill="#ff0000" />
    </svg>
  );
};

export default UAEFlag;
