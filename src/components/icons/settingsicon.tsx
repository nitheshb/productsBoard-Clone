

import clsx from 'clsx';
import React from 'react';

type Props = { selected: boolean };

const SettingsIcon = ({ selected }: Props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none" // Fill is managed by className
    >
      <path
        d="M12 15.5C10.07 15.5 8.5 13.93 8.5 12C8.5 10.07 10.07 8.5 12 8.5C13.93 8.5 15.5 10.07 15.5 12C15.5 13.93 13.93 15.5 12 15.5ZM12 7C9.24 7 7 9.24 7 12C7 14.76 9.24 17 12 17C14.76 17 17 14.76 17 12C17 9.24 14.76 7 12 7Z"
        className={clsx('fill-current', { 'fill-white': selected, 'fill-gray-900': !selected })}
      />
      <path
        d="M22 12.87V11.13L19.87 10.21C19.62 9.47 19.3 8.78 18.92 8.14L20.31 6.22L18.78 4.69L16.86 6.08C16.22 5.7 15.53 5.38 14.79 5.13L13.87 3H10.13L9.21 5.13C8.47 5.38 7.78 5.7 7.14 6.08L5.22 4.69L3.69 6.22L5.08 8.14C4.7 8.78 4.38 9.47 4.13 10.21L2 11.13V12.87L4.13 13.79C4.38 14.53 4.7 15.22 5.08 15.86L3.69 17.78L5.22 19.31L7.14 17.92C7.78 18.3 8.47 18.62 9.21 18.87L10.13 21H13.87L14.79 18.87C15.53 18.62 16.22 18.3 16.86 17.92L18.78 19.31L20.31 17.78L18.92 15.86C19.3 15.22 19.62 14.53 19.87 13.79L22 12.87ZM12 19C8.14 19 5 15.86 5 12C5 8.14 8.14 5 12 5C15.86 5 19 8.14 19 12C19 15.86 15.86 19 12 19Z"
        className={clsx('fill-current', { 'fill-white': selected, 'fill-gray-900': !selected })}
      />
    </svg>
  );
};

export default SettingsIcon;
