
// import clsx from 'clsx'
// import React from 'react'

// type Props = { selected: boolean }

// const Tasks = ({ selected }: Props) => {
//   return (
//     <svg
//       width="13"
//       height="13"
//       viewBox="0 0 21.527 20.47"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//       className={clsx(
//         'transition-all',
//         { 'dark:!fill-[#C8C7FF] !fill-[#7540A9]': selected }
//       )}
//     >
//       <path
//         data-name="Path 42934"
//         d="M6.251 38.585a10.238 10.238 0 0 1 7.716-18.965 1.039 1.039 0 1 1-.73 1.946 8.165 8.165 0 1 0 5.155 7.586v-.08a1.04 1.04 0 0 1 2.079 0v.078a10.188 10.188 0 0 1-1.748 5.722 10.265 10.265 0 0 1-4.5 3.708 10.269 10.269 0 0 1-7.968 0zm3.535-6.5L5.92 28.216a1.115 1.115 0 1 1 1.58-1.577l3 3 .057.057.057-.057L19.6 20.65a1.131 1.131 0 0 1 1.6 1.6l-9.821 9.821-.005.005-.005.005a1.117 1.117 0 0 1-1.577 0z"
//         transform="translate(0 -18.919)"
//         className={clsx(
//           'fill-black dark:fill-[#353346]',
//           { 'dark:!fill-[#C8C7FF] !fill-[#7540A9]': selected }
//         )}
//       />
//     </svg>
//   )
// }

// export default Tasks



import clsx from 'clsx'
import React from 'react'

type Props = { 
  selected: boolean
  width?: number | string
  height?: number | string
}

const Tasks = ({ selected, width = 13, height = 13 }: Props) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 21.527 20.47"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={clsx(
        'transition-all',
        { 'dark:!fill-[#C8C7FF] !fill-[#7540A9]': selected }
      )}
    >
      <path
        data-name="Path 42934"
        d="M6.251 38.585a10.238 10.238 0 0 1 7.716-18.965 1.039 1.039 0 1 1-.73 1.946 8.165 8.165 0 1 0 5.155 7.586v-.08a1.04 1.04 0 0 1 2.079 0v.078a10.188 10.188 0 0 1-1.748 5.722 10.265 10.265 0 0 1-4.5 3.708 10.269 10.269 0 0 1-7.968 0zm3.535-6.5L5.92 28.216a1.115 1.115 0 1 1 1.58-1.577l3 3 .057.057.057-.057L19.6 20.65a1.131 1.131 0 0 1 1.6 1.6l-9.821 9.821-.005.005-.005.005a1.117 1.117 0 0 1-1.577 0z"
        transform="translate(0 -18.919)"
               className={clsx('fill-current', { 'fill-white': selected, 'fill-gray-900': !selected })}
      />
    </svg>
  )
}

export default Tasks
