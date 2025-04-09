
// import React from 'react';

// type Props = { selected: boolean };

// const AllLibraries = ({ selected }: Props) => {
//   return (
//     <svg
//       width="13"
//       height="13"
//       viewBox="0 0 22.683 22"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       <g transform="translate(23536.342 -2182)">
//         <path
//           d="M10,0,0,5l10,5L20,5Z"
//           transform="translate(-23535 2183)"
//           fill="none"
//           stroke="currentColor"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           strokeWidth="2"
//         />
//         <path
//           d="M0,15l10,5,10-5"
//           transform="translate(-23535 2183)"
//           fill="none"
//           stroke="currentColor"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           strokeWidth="2"
//         />
//         <path
//           d="M0,10l10,5,10-5"
//           transform="translate(-23535 2183)"
//           fill="none"
//           stroke="currentColor"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           strokeWidth="2"
//         />
//       </g>
//     </svg>
//   );
// };

// export default AllLibraries;


import clsx from 'clsx';
import React from 'react';

type Props = { selected: boolean };

const AllLibraries = ({ selected }: Props) => {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 22.683 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="translate(23536.342 -2182)">
        <path
          d="M10,0,0,5l10,5L20,5Z"
          transform="translate(-23535 2183)"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className={clsx('fill-current', { 'stroke-white': selected, 'stroke-gray-900': !selected })}
        />
        <path
          d="M0,15l10,5,10-5"
          transform="translate(-23535 2183)"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className={clsx('fill-current', { 'stroke-white': selected, 'stroke-gray-900': !selected })}
        />
        <path
          d="M0,10l10,5,10-5"
          transform="translate(-23535 2183)"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className={clsx('fill-current', { 'stroke-white': selected, 'stroke-gray-900': !selected })}
        />
      </g>
    </svg>
  );
};

export default AllLibraries;
