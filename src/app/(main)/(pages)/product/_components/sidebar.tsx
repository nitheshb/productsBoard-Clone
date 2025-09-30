
'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState('products');
  const router = useRouter();
  const pathname = usePathname();

  // Update active item based on current route
  useEffect(() => {
    if (pathname === '/employees') {
      setActiveItem('employees');
    } else if (pathname === '/product') {
      setActiveItem('products');
    } else if (pathname === '/') {
      setActiveItem('products'); // Default to products instead of home
    }
  }, [pathname]);
  
  const menuItems = [
    {
      id: 'search',
      label: 'Search',
      icon: (
        <svg height="16px" width="16px" viewBox="0 0 16 16" role="img" aria-label="SearchIcon" className="sc-fQpRED bUGbIN ui-icon"><path fill="currentColor" fillRule="evenodd" d="M6.667 2.75a3.917 3.917 0 1 0 0 7.833 3.917 3.917 0 0 0 0-7.833M1.25 6.667a5.417 5.417 0 1 1 9.74 3.263l3.54 3.54a.75.75 0 1 1-1.06 1.06l-3.54-3.54a5.417 5.417 0 0 1-8.68-4.324" clipRule="evenodd"></path></svg>
      )
    },
    {
      id: 'home',
      label: 'Home',
      icon: (
        <svg height="16px" width="16px" viewBox="0 0 16 16" role="img" aria-label="HomeIcon" className="sc-fQpRED bUGbIN ui-icon"><path fill="currentColor" fillRule="evenodd" d="m8 2.286-.047.035-.147.114L3.284 5.95c-.336.262-.386.31-.42.354a.6.6 0 0 0-.092.19c-.015.054-.022.123-.022.548v4.824c0 .385 0 .63.016.814.014.176.038.231.048.25.056.11.145.2.255.255.019.01.074.034.25.048.185.015.429.016.814.016H5.25V9.044c0-.167 0-.334.012-.476a1.4 1.4 0 0 1 .143-.544c.135-.267.352-.484.619-.62.194-.099.386-.13.544-.142.142-.012.31-.012.476-.012h1.912c.167 0 .334 0 .476.012.158.012.35.043.545.142.266.136.483.353.619.62.099.194.13.386.143.544.011.142.011.309.011.476v4.206h1.117c.385 0 .63 0 .814-.016.176-.014.231-.038.25-.048a.6.6 0 0 0 .256-.255c.01-.019.033-.074.047-.25.015-.184.016-.429.016-.814V7.043c0-.425-.006-.494-.021-.548a.6.6 0 0 0-.093-.19c-.034-.045-.084-.092-.42-.354L8.195 2.435zM7.63.81c.242-.065.498-.065.74 0 .283.077.52.263.695.401l.05.04 4.522 3.516.054.043c.248.192.479.37.65.603.151.204.264.434.332.678.078.278.078.57.077.884v4.92c0 .35 0 .655-.02.909-.023.268-.071.543-.207.809-.2.392-.518.71-.91.91-.266.135-.54.184-.81.206-.253.021-.559.021-.908.021h-1.378c-.078 0-.176 0-.264-.007a1.1 1.1 0 0 1-.411-.111 1.1 1.1 0 0 1-.474-.473 1.1 1.1 0 0 1-.11-.412c-.008-.088-.008-.186-.008-.264V9.067c0-.149 0-.244-.003-.314a9 9 0 0 0-.314-.003H7.067c-.149 0-.244 0-.314.003a9 9 0 0 0-.003.314v4.416c0 .078 0 .176-.007.264-.008.102-.03.252-.111.412-.104.203-.27.37-.473.473a1.1 1.1 0 0 1-.412.111c-.087.007-.186.007-.264.007H4.105c-.349 0-.655 0-.908-.02a2.1 2.1 0 0 1-.81-.207c-.391-.2-.71-.518-.91-.91a2.1 2.1 0 0 1-.206-.81c-.02-.253-.02-.559-.02-.908v-4.92c-.001-.314-.002-.606.076-.884.069-.244.18-.474.331-.678.172-.232.403-.41.65-.603l.055-.043 4.522-3.516.05-.04c.176-.138.412-.324.695-.4" clipRule="evenodd"></path></svg>
      )
    },
    {
      id: 'insights',
      label: 'Insights',
      icon: (
        <svg height="16px" width="16px" viewBox="0 0 16 16" role="img" aria-label="InsightsIcon" className="sc-fQpRED bUGbIN ui-icon"><path fill="currentColor" fillRule="evenodd" d="M2.584 6a5.417 5.417 0 1 1 8.166 4.668v.022c0 .29 0 .546-.014.757-.016.224-.05.455-.144.684-.212.51-.617.916-1.128 1.127-.23.095-.46.129-.683.144-.212.015-.467.015-.757.015h-.047c-.29 0-.546 0-.757-.015a2.1 2.1 0 0 1-.684-.144 2.08 2.08 0 0 1-1.127-1.127 2.1 2.1 0 0 1-.144-.684c-.015-.211-.015-.466-.015-.757v-.022A5.41 5.41 0 0 1 2.584 6M8 2.083A3.917 3.917 0 0 0 6.322 9.54a.75.75 0 0 1 .428.678v.449c0 .32 0 .524.011.678.01.148.027.196.034.212.059.143.172.256.315.315a.7.7 0 0 0 .212.034c.154.01.357.01.678.01s.524 0 .679-.01a.7.7 0 0 0 .211-.034.58.58 0 0 0 .316-.315.7.7 0 0 0 .033-.212c.01-.154.011-.357.011-.678v-.45a.75.75 0 0 1 .428-.677A3.917 3.917 0 0 0 8 2.083M5.584 14.667a.75.75 0 0 1 .75-.75h3.333a.75.75 0 0 1 0 1.5H6.334a.75.75 0 0 1-.75-.75" clipRule="evenodd"></path></svg>
      )
    },
    {
      id: 'products',
      label: 'Products',
      icon: (
        <svg height="16px" width="16px" viewBox="0 0 16 16" role="img" aria-label="ProductIcon" className="sc-fQpRED bUGbIN ui-icon"><path fill="currentColor" fillRule="evenodd" d="M1.25 4A2.75 2.75 0 0 1 4 1.25h8A2.75 2.75 0 0 1 14.75 4v8A2.75 2.75 0 0 1 12 14.75H4A2.75 2.75 0 0 1 1.25 12zM4 2.75c-.69 0-1.25.56-1.25 1.25v1.25h10.5V4c0-.69-.56-1.25-1.25-1.25zm9.25 4H2.75V12c0 .69.56 1.25 1.25 1.25h8c.69 0 1.25-.56 1.25-1.25z" clipRule="evenodd"></path></svg>
      )
    },
    {
      id: 'portals',
      label: 'Portals',
      icon: (
        <svg height="16px" width="16px" viewBox="0 0 16 16" role="img" aria-label="PortalIcon" className="sc-fQpRED bUGbIN ui-icon"><path fill="currentColor" fillRule="evenodd" d="M8 2.083a5.917 5.917 0 1 0 0 11.834A5.917 5.917 0 0 0 8 2.083M.583 8a7.417 7.417 0 1 1 14.834 0A7.417 7.417 0 0 1 .583 8m9.058-1.64-2.461.82-.82 2.46 2.46-.82zm.382-1.697c.125-.03.373-.078.64.017.307.11.548.35.657.656.096.268.046.516.017.64-.03.13-.08.28-.128.423l-.008.023-.992 2.976-.005.017c-.021.065-.07.214-.16.346q-.116.168-.282.283a1.4 1.4 0 0 1-.364.165l-2.975.992-.024.008a5 5 0 0 1-.422.128c-.125.03-.373.078-.64-.017a1.08 1.08 0 0 1-.657-.656 1.1 1.1 0 0 1-.017-.64c.03-.13.081-.281.128-.423l.008-.023.992-2.976.006-.017c.02-.065.069-.214.16-.346q.113-.168.282-.283c.132-.09.281-.139.346-.16l.018-.005 2.975-.992.023-.008a5 5 0 0 1 .422-.128" clipRule="evenodd"></path></svg>
      )
    },
    {
      id: 'employees',
      label: 'Employees',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      )
    },
    {
      id: 'more',
      label: 'More',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="5" cy="12" r="1"></circle>
          <circle cx="12" cy="12" r="1"></circle>
          <circle cx="19" cy="12" r="1"></circle>
        </svg>
      )
    }
  ];

  return (
    <div className="flex flex-col items-center w-16 h-screen bg-gray-50 border-r border-gray-200">
      {/* Logo */}
      <div className="mt-4 mb-6">
        <div className="w-8 h-8">
        <svg height="16px" viewBox="0 0 162 108" data-testid="AppHeader-Logo" data-nc="true"><path fill="#0071E1" d="M108.001 0L162 54l-54.001 54-53.996-54L108 0z"></path><path fill="#FFC600" d="M107.997 0L53.999 54 0 0h107.997z"></path><path fill="#F84136" d="M53.999 54l53.998 54H0l53.999-54z"></path></svg>
        </div>
      </div>

      {/* Add Button */}
      <div className="mb-6">
        <button className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="w-full flex-grow">
        <ul className="w-full">
          {menuItems.map((item) => (
            <li
              key={item.id}
              className={`flex flex-col items-center py-3 cursor-pointer relative ${
                activeItem === item.id ? 'text-blue-500' : 'text-black'
              } hover:bg-gray-100`}
              onClick={() => {
                if (item.id === 'employees') {
                  setActiveItem(item.id);
                  router.push('/employees');
                } else if (item.id === 'products') {
                  setActiveItem(item.id);
                  router.push('/product');
                } else if (item.id === 'home') {
                  alert('Coming Soon: Home Dashboard');
                } else if (item.id === 'search') {
                  alert('Coming Soon: Search Feature');
                } else if (item.id === 'insights') {
                  alert('Coming Soon: Analytics & Insights');
                } else if (item.id === 'portals') {
                  alert('Coming Soon: Portals Management');
                }
              }}
            >
              <div className="mb-1">{item.icon}</div>
              <span className="text-xs">{item.label}</span>
              {activeItem === item.id && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Icons */}
      <div className="mt-auto w-full">
        <div className="flex flex-col items-center">
          <div className="py-3 text-black cursor-pointer hover:text-blue-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
          </div>
          <div className="py-3 text-black cursor-pointer hover:text-blue-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;