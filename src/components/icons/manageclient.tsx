// import clsx from 'clsx'
// import React from 'react'

// type Props = { selected: boolean }

// const ManageClient = ({ selected }: Props) => {
//   return (
//     <svg
//       width="13"
//       height="13"
//       viewBox="0 0 14.267 16"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       <defs>
//         <clipPath id="jjbzl5ls7a">
//           <path
//             data-name="Rectangle 14533"
//             d="M0 0h14.267v16H0z"
//             style={{ fill: 'currentcolor' }}
//           ></path>
//         </clipPath>
//       </defs>
//       <path
//         data-name="Path 43317"
//         d="m17.4 132.453.781-.01V130.5H17.4z"
//         transform="translate(-15.561 -116.681)"
//         style={{ fill: 'currentcolor' }}
//       ></path>
//       <g data-name="Group 21347">
//         <g
//           data-name="Group 21346"
//           style={{ clipPath: 'url(#jjbzl5ls7a)' }}
//         >
//           <path
//             data-name="Path 43318"
//             d="M12.58 10.933 9.3 9.22V8a3.971 3.971 0 0 0 1.285-2.8 4.075 4.075 0 0 0 .022-.429 4.09 4.09 0 0 0-.043-2.858 1.458 1.458 0 0 0-.873-.632 1.462 1.462 0 0 0-.865-.965A3.721 3.721 0 0 0 5.61.421L5.6.429a65.451 65.451 0 0 1-.844.73c-1.263.386-1.621 1.535-1.099 3.511v.5a3.985 3.985 0 0 0 1.319 2.867v1.187l-3.235 1.718A3.182 3.182 0 0 0 0 13.79v1.979h.782V13.79A2.4 2.4 0 0 1 2.1 11.634l3.319-1.765h.39l.5 1.18-.194 3.483a.389.389 0 0 0 .048.212l.592 1.056.031.054.023.026h.007A.391.391 0 0 0 7.1 16a.392.392 0 0 0 .342-.2l.658-1.184a.392.392 0 0 0 .048-.21l-.181-3.363.5-1.173h.39l3.361 1.753a2.415 2.415 0 0 1 1.273 2.132v2.015h.781v-2.016a3.192 3.192 0 0 0-1.687-2.822"
//             transform="translate(0 -.001)"
//             style={{ fill: 'currentcolor' }}
//           ></path>
//           <path
//             data-name="Path 43319"
//             d="m109.931 132.453.781-.01V130.5h-.781z"
//             transform="translate(-98.289 -116.681)"
//             style={{ fill: 'currentcolor' }}
//           ></path>
//         </g>
//       </g>
//     </svg>
//   )
// }

// export default ManageClient


import clsx from 'clsx';
import React from 'react';

type Props = { selected: boolean };

const ManageClient = ({ selected }: Props) => {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 14.267 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <clipPath id="jjbzl5ls7a">
          <path
            data-name="Rectangle 14533"
            d="M0 0h14.267v16H0z"
            style={{ fill: 'currentcolor' }}
          ></path>
        </clipPath>
      </defs>
      <path
        data-name="Path 43317"
        d="m17.4 132.453.781-.01V130.5H17.4z"
        transform="translate(-15.561 -116.681)"
        className={clsx('fill-current', { 'fill-white': selected, 'fill-gray-900': !selected })}
      ></path>
      <g data-name="Group 21347">
        <g
          data-name="Group 21346"
          style={{ clipPath: 'url(#jjbzl5ls7a)' }}
        >
          <path
            data-name="Path 43318"
            d="M12.58 10.933 9.3 9.22V8a3.971 3.971 0 0 0 1.285-2.8 4.075 4.075 0 0 0 .022-.429 4.09 4.09 0 0 0-.043-2.858 1.458 1.458 0 0 0-.873-.632 1.462 1.462 0 0 0-.865-.965A3.721 3.721 0 0 0 5.61.421L5.6.429a65.451 65.451 0 0 1-.844.73c-1.263.386-1.621 1.535-1.099 3.511v.5a3.985 3.985 0 0 0 1.319 2.867v1.187l-3.235 1.718A3.182 3.182 0 0 0 0 13.79v1.979h.782V13.79A2.4 2.4 0 0 1 2.1 11.634l3.319-1.765h.39l.5 1.18-.194 3.483a.389.389 0 0 0 .048.212l.592 1.056.031.054.023.026h.007A.391.391 0 0 0 7.1 16a.392.392 0 0 0 .342-.2l.658-1.184a.392.392 0 0 0 .048-.21l-.181-3.363.5-1.173h.39l3.361 1.753a2.415 2.415 0 0 1 1.273 2.132v2.015h.781v-2.016a3.192 3.192 0 0 0-1.687-2.822"
            transform="translate(0 -.001)"
            className={clsx('fill-current', { 'fill-white': selected, 'fill-gray-900': !selected })}
          ></path>
          <path
            data-name="Path 43319"
            d="m109.931 132.453.781-.01V130.5h-.781z"
            transform="translate(-98.289 -116.681)"
            className={clsx('fill-current', { 'fill-white': selected, 'fill-gray-900': !selected })}
          ></path>
        </g>
      </g>
    </svg>
  );
};

export default ManageClient;
