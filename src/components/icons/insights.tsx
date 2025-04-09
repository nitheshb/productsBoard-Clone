// import clsx from 'clsx';
// import React from 'react';

// type Props = { selected: boolean };

// const Insights = ({ selected }: Props) => {
//   return (
//     <svg
//       id="Group_26580"
//       data-name="Group 26580"
//       xmlns="http://www.w3.org/2000/svg"
//       // xmlns:xlink="http://www.w3.org/1999/xlink"
//       width="16"
//       height="15.938"
//       viewBox="0 0 16 15.938"
//     >
//       <defs>
//         <clipPath id="clip-path">
//           <rect
//             id="Rectangle_15625"
//             data-name="Rectangle 15625"
//             width="16"
//             height="15.939"
//             fill="currentColor"
//           />
//         </clipPath>
//       </defs>
//       <g id="Group_26575" data-name="Group 26575" clipPath="url(#clip-path)">
//         <path
//           id="Path_59086"
//           data-name="Path 59086"
//           d="M15.142,14.345H2.391a.8.8,0,0,1-.8-.8V.8A.8.8,0,0,0,0,.8V13.548a2.391,2.391,0,0,0,2.391,2.391H15.142a.8.8,0,0,0,0-1.594"
//           className={clsx(
//             'dark:group-hover:fill-[#C8C7FF] transition-all dark:fill-[#353346] fill-[#C0BFC4] group-hover:fill-[#7540A9]',
//             { 'dark:!fill-[#C8C7FF] !fill-[#7540A9]': selected }
//           )}
//         />
//         <path
//           id="Path_59087"
//           data-name="Path 59087"
//           d="M11.538,15.092l1.51-3.53,2.359,2.355a.8.8,0,0,0,1.275-.207l2.285-4.57.291.875a.8.8,0,0,0,1.512-.5l-.887-2.662a.8.8,0,0,0-1.008-.5l-2.612.87a.8.8,0,0,0,.5,1.512l.749-.249L15.75,12.007,13.359,9.617a.8.8,0,0,0-1.127,0,.788.788,0,0,0-.168.247l-1.992,4.614a.8.8,0,0,1-.733.47H8v1.594H9.339a2.391,2.391,0,0,0,2.2-1.45"
//           transform="translate(-4.812 -3.791)"
//           className={clsx(
//             'dark:group-hover:fill-[#9F54FF] transition-all dark:fill-[#C0BFC4] fill-[#5B5966] group-hover:fill-[#BD8AFF]',
//             { 'dark:!fill-[#9F54FF] fill-[#BD8AFF]': selected }
//           )}
//         />
//       </g>
//     </svg>
//   );
// };

// export default Insights;



import React from 'react';

type Props = { selected: boolean };

const Insights = ({ selected }: Props) => {
  return (
    <svg
      id="Group_26580"
      data-name="Group 26580"
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="15.938"
      viewBox="0 0 16 15.938"
    >
      <defs>
        <clipPath id="clip-path">
          <rect
            id="Rectangle_15625"
            data-name="Rectangle 15625"
            width="16"
            height="15.939"
            fill="currentColor"
          />
        </clipPath>
      </defs>
      <g id="Group_26575" data-name="Group 26575" clipPath="url(#clip-path)">
        <path
          id="Path_59086"
          data-name="Path 59086"
          d="M15.142,14.345H2.391a.8.8,0,0,1-.8-.8V.8A.8.8,0,0,0,0,.8V13.548a2.391,2.391,0,0,0,2.391,2.391H15.142a.8.8,0,0,0,0-1.594"
          fill="currentColor"
        />
        <path
          id="Path_59087"
          data-name="Path 59087"
          d="M11.538,15.092l1.51-3.53,2.359,2.355a.8.8,0,0,0,1.275-.207l2.285-4.57.291.875a.8.8,0,0,0,1.512-.5l-.887-2.662a.8.8,0,0,0-1.008-.5l-2.612.87a.8.8,0,0,0,.5,1.512l.749-.249L15.75,12.007,13.359,9.617a.8.8,0,0,0-1.127,0,.788.788,0,0,0-.168.247l-1.992,4.614a.8.8,0,0,1-.733.47H8v1.594H9.339a2.391,2.391,0,0,0,2.2-1.45"
          transform="translate(-4.812 -3.791)"
          fill="currentColor"
        />
      </g>
    </svg>
  );
};

export default Insights;
