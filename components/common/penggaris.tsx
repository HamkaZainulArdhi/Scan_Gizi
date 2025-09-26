// import { useEffect, useRef, useState } from 'react';

// const Penggaris = ({ children, step = 20 }) => {
//   const ref = useRef(null);
//   const [width, setWidth] = useState(0);
//   const [height, setHeight] = useState(0);

//   useEffect(() => {
//     if (ref.current) {
//       setWidth(ref.current.offsetWidth);
//       setHeight(ref.current.offsetHeight);
//     }
//   }, [children]);

//   const horizontalTicks = Array.from(
//     { length: Math.floor(width / step) + 1 },
//     (_, i) => i,
//   );
//   const verticalTicks = Array.from(
//     { length: Math.floor(height / step) + 1 },
//     (_, i) => i,
//   );

//   return (
//     <div ref={ref} className="penggaris-box p-4 relative">
//       {children}

//       {/* Horizontal top */}
//       {horizontalTicks.map((i) => (
//         <div
//           key={`ht-${i}`}
//           className="tick h-1 w-[1px] top-0"
//           style={{ left: `${i * step}px` }}
//         ></div>
//       ))}
//       {/* Horizontal bottom */}
//       {horizontalTicks.map((i) => (
//         <div
//           key={`hb-${i}`}
//           className="tick h-1 w-[1px] bottom-0"
//           style={{ left: `${i * step}px` }}
//         ></div>
//       ))}

//       {/* Vertical left */}
//       {verticalTicks.map((i) => (
//         <div
//           key={`vl-${i}`}
//           className="tick w-1 h-[1px] left-0"
//           style={{ top: `${i * step}px` }}
//         ></div>
//       ))}
//       {/* Vertical right */}
//       {verticalTicks.map((i) => (
//         <div
//           key={`vr-${i}`}
//           className="tick w-1 h-[1px] right-0"
//           style={{ top: `${i * step}px` }}
//         ></div>
//       ))}

//       {/* Optional: angka horizontal di atas */}
//       {horizontalTicks.map((i) => (
//         <span
//           key={`num-h-${i}`}
//           className="tick-number -top-4"
//           style={{ left: `${i * step}px` }}
//         >
//           {i * step}
//         </span>
//       ))}

//       {/* Optional: angka vertikal di kiri */}
//       {verticalTicks.map((i) => (
//         <span
//           key={`num-v-${i}`}
//           className="tick-number -left-6"
//           style={{ top: `${i * step}px` }}
//         >
//           {i * step}
//         </span>
//       ))}
//     </div>
//   );
// };

// export default Penggaris;
