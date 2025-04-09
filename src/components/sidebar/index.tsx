
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useState } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { menuOptions, footerOptions } from '@/lib/constant'
import clsx from 'clsx'
import { Separator } from '@/components/ui/separator'
import RDash from '../icons/rdash'
import RIcon from '../icons/ricon'
import { ModeToggle } from '../global/mode-toggle'

type Props = {
  isExpanded: boolean
}

const MenuOptions = ({ isExpanded }: Props) => {
  const pathName = usePathname()

  // State to track hover state for the entire sidebar
  const [isSidebarHovered, setIsSidebarHovered] = useState(false)

  const renderMenuItems = (items: typeof menuOptions | typeof footerOptions) => (
    <TooltipProvider>
      {items.map((item) => (
        item.Component === RDash ? (
          // RDash component with hover effect
          <ul key={item.name} className="flex items-center w-full">
            <Tooltip delayDuration={0}>
              <TooltipTrigger className="w-full">
                <li
                  className="relative flex items-center justify-start w-full"
                >
                  <Link
                    href={item.href}
                    className="flex items-center w-full group"
                  >
                    <div 
                      className={clsx(
                        'flex items-center w-full rounded-lg p-2 transition-all duration-300 group',
                        {
                          // Active state styles (when current page is active)
                          'bg-red-600 text-white': pathName === item.href,
                          // Inactive state styles (for all other pages)
                          'bg-white text-black': pathName !== item.href,
                          'hover:bg-white hover:text-black': isExpanded
                        }
                      )}
                    >
                      <div 
                        className={clsx(
                          'flex items-center justify-center scale-[1.5] rounded-lg p-[3px] mr-4',
                          {
                            'text-white': pathName === item.href,  // Active state icon color
                            'text-black': pathName !== item.href  // Inactive state icon color
                          }
                        )}
                      >
                        {/* Display RDash if the sidebar is hovered, else show RIcon */}
                        {isSidebarHovered ? (
                          <RDash selected={pathName === item.href} />
                        ) : (
                          <RIcon selected={pathName === item.href} />
                        )}
                      </div>
                      {isExpanded && (
                        <span className="text-lg transition-opacity duration-300">
                          {item.name}
                        </span>
                      )}
                    </div>
                  </Link>
                </li>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-black/10 backdrop-blur-xl">
                <p>{item.name}</p>
              </TooltipContent>
            </Tooltip>
          </ul>
        ) : (
          // Render other menu items normally
          <ul key={item.name} className="flex items-center w-full">
            <Tooltip delayDuration={0}>
              <TooltipTrigger className="w-full">
                <li className="relative flex items-center justify-start w-full">
                  <Link
                    href={item.href}
                    className="flex items-center w-full group"
                  >
                    <div 
                      className={clsx(
                        'flex items-center w-full rounded-lg p-2 transition-all duration-300 group',
                        {
                          // Active state styles (when current page is active)
                          'bg-red-600 text-white': pathName === item.href,
                          // Inactive state styles (for all other pages)
                          'bg-white text-black': pathName !== item.href,
                          'hover:bg-white hover:text-black': isExpanded
                        }
                      )}
                    >
                      <div 
                        className={clsx(
                          'flex items-center justify-center scale-[1.5] rounded-lg p-[3px] mr-4',
                          {
                            'text-white': pathName === item.href,  // Active state icon color
                            'text-black': pathName !== item.href  // Inactive state icon color
                          }
                        )}
                      >
                        <item.Component selected={pathName === item.href} />
                      </div>
                      {isExpanded && (
                        <span className="text-lg transition-opacity duration-300">
                          {item.name}
                        </span>
                      )}
                    </div>
                  </Link>
                </li>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-black/10 backdrop-blur-xl">
                <p>{item.name}</p>
              </TooltipContent>
            </Tooltip>
          </ul>
        )
      ))}
    </TooltipProvider>
  )

  return (
    <nav
      className="dark:bg-black h-screen flex items-center flex-col py-6 px-2 transition-all duration-300"
      onMouseEnter={() => setIsSidebarHovered(true)}  // When mouse enters sidebar
      onMouseLeave={() => setIsSidebarHovered(false)} // When mouse leaves sidebar
    >
      <div className="flex flex-col items-start gap-4 w-full">
        {/* Main Menu Items */}
        {renderMenuItems(menuOptions)}
        
        <Separator />
        
        {/* Footer Items */}
        <div className="mt-auto flex flex-col items-start gap-4 w-250 absolute bottom-0">
          {renderMenuItems(footerOptions)}
        </div>

        {/* <div className="flex items-center justify-center flex-col gap-8 bg-white text-white border-none">
        <ModeToggle />
      </div> */}
      </div>
    </nav>
  )
}

export default MenuOptions
