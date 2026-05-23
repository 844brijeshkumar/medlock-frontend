const FallBack = () => {
  return (
    <div className="pre-loader-container ">
      <svg viewBox="0 0 240 240" style={{ width: "128px", height: "128px" }}>
        <path
          className="draw-line d1"
          pathLength="1"
          d="M 120 20 A 100 100 0 0 0 120 220"
        />
        <path
          className="draw-line d1"
          pathLength="1"
          d="M 120 20 A 100 100 0 0 1 120 220"
        />
        <rect
          className="draw-line d2"
          pathLength="1"
          x="70"
          y="104"
          width="100"
          height="75"
          rx="8"
        />
        <path
          className="draw-line d3"
          pathLength="1"
          d="M 145 104 L 145 68 A 25 25 0 0 0 95 68 L 95 85"
        />
        <path
          className="draw-line d4"
          pathLength="1"
          d="M 115 142 A 9 9 0 1 1 125 142 L 128 159 A 2 2 0 0 1 126 161 L 114 161 A 2 2 0 0 1 112 159 Z"
        />
      </svg>
    </div>
  );
};

export default FallBack;
