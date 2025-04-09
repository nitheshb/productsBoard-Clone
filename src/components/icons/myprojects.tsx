
import clsx from 'clsx'
import React from 'react'

type Props = { selected: boolean }

const ProjectIcon = ({ selected }: Props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="13"
      height="13"
      viewBox="0 0 17.99 16"
      fill="none"
    >
      <path
        data-name="Path 42830"
        d="M127.238 70.774h-2.6v-.762a1.693 1.693 0 0 0-1.693-1.693h-3.661a1.693 1.693 0 0 0-1.693 1.693v.762h-2.836A2.751 2.751 0 0 0 112 73.525v8.042a2.751 2.751 0 0 0 2.751 2.751h12.487a2.752 2.752 0 0 0 2.751-2.751v-8.042a2.751 2.751 0 0 0-2.751-2.751zm-7.958-.762h3.661v.762h-3.661zm-4.529 2.455h12.487a1.058 1.058 0 0 1 1.058 1.058v5.968h-14.6v-5.968a1.058 1.058 0 0 1 1.058-1.058zm12.487 10.159h-12.487a1.058 1.058 0 0 1-1.058-1.058v-.381h14.6v.381a1.058 1.058 0 0 1-1.058 1.058z"
        transform="translate(-112 -68.319)"
        className={clsx('fill-current', { 'fill-white': selected, 'fill-gray-900': !selected })}
      />
    </svg>
  )
}

export default ProjectIcon
  


// import clsx from 'clsx';
// import React from 'react';

// type Props = { selected: boolean };

// const ProjectIcon = ({ selected }: Props) => {
//   return (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       width="13"
//       height="13"
//       viewBox="0 0 18.99 16"
//       fill="none"
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
//       <g id="Group_26575" data-name="Group_26575" clipPath="url(#clip-path)">
//         <path
//           d="M127.238 70.774h-2.6v-.762a1.693 1.693 0 0 0-1.693-1.693h-3.661a1.693 1.693 0 0 0-1.693 1.693v.762h-2.836A2.751 2.751 0 0 0 112 73.525v8.042a2.751 2.751 0 0 0 2.751 2.751h12.487a2.752 2.752 0 0 0 2.751-2.751v-8.042a2.751 2.751 0 0 0-2.751-2.751zm-7.958-.762h3.661v.762h-3.661zm-4.529 2.455h12.487a1.058 1.058 0 0 1 1.058 1.058v5.968h-14.6v-5.968a1.058 1.058 0 0 1 1.058-1.058zm12.487 10.159h-12.487a1.058 1.058 0 0 1-1.058-1.058v-.381h14.6v.381a1.058 1.058 0 0 1-1.058 1.058z"
//           transform="translate(-112 -68.319)"
//           className={clsx('fill-current', { 'fill-white': selected, 'fill-gray-900': !selected })}
//         />
//       </g>
//     </svg>
//   );
// };

// export default ProjectIcon;
