
import clsx from 'clsx'
import React from 'react'

type Props = { selected: boolean }

const RIcon = ({ selected }: Props) => {
  return (
    <svg
      width="95"
      height="20"
      viewBox="0 0 120.489 36.134"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <clipPath id="39rt29cc7a">
          <path
            data-name="Rectangle 11967"
            d="M0 0h119.489v36.134H0z"
            style={{ fill: 'none' }}
          />
        </clipPath>
      </defs>
      <g data-name="Group 17690">
        <g data-name="Group 17689">
          <g
            data-name="Group 17686"
            style={{ clipPath: 'url(#39rt29cc7a)' }}
          >
            <path
              data-name="Path 15101"
              d="M18.651 141.058a7.384 7.384 0 0 0-2.817-1.24 15.191 15.191 0 0 0-3.3-.345H3.3L0 163.083h6.756l1.192-8.651h.822l3.332 8.651h7.928l-4.368-9.464a7.028 7.028 0 0 0 3.113-2.044 8.4 8.4 0 0 0 1.976-4.4 7.279 7.279 0 0 0-.27-3.659 5.419 5.419 0 0 0-1.829-2.453m-4.8 5.806a1.521 1.521 0 0 1-.324.838 1.81 1.81 0 0 1-.7.47 3.643 3.643 0 0 1-1.047.215q-.685.044-1.3.044H8.8l.4-2.955h2.26a8.452 8.452 0 0 1 1.163.082 2.486 2.486 0 0 1 .821.246.882.882 0 0 1 .369.363 1.148 1.148 0 0 1 .036.7"
              transform="translate(0 -127.007)"
              className={clsx(
                'dark:group-hover:fill-[#000000] transition-all dark:fill-[#000000] fill-[#000000] group-hover:fill-[#000000]',
                { 'dark:!fill-[#000000] !fill-[#000000]': selected }
              )}
            />
         
            {/* Red color for the "R" */}
            <path
              data-name="Path 15107"
              d="M257.776 3.25 253.6 15.037a.31.31 0 0 0 .37.4l5.459-1.4a.31.31 0 0 1 .378.376l-3.054 12.1a.311.311 0 0 0 .572.229l9.206-16.25a.31.31 0 0 0-.323-.458l-6.49 1.119a.31.31 0 0 1-.322-.458L265.228.464a.31.31 0 0 0-.4-.438l-6.89 3.044a.31.31 0 0 0-.162.18z"
              transform="translate(-230.914)"
              style={{ fill: 'rgb(220, 38, 38)' }} // Red-600
            />
            {/* Added additional paths */}
            
          </g>
        </g>
      </g>
    </svg>
  )
}

export default RIcon
