

// 'use client';
// import { useState } from 'react';
// import ProductTable from '@/app/(main)/(pages)/productTable/ProductTable';
// import { Search } from 'lucide-react';
// import ProductDropdown from '@/app/(main)/(pages)/productDropdown/ProductDropdown';
// import Sidebar from './_components/sidebar';

// export default function Home() {
//     const [searchQuery, setSearchQuery] = useState('');
//     const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

//     const handleProductsSelect = (productIds: string[]) => {
//         setSelectedProductIds(productIds);
//     };

//     return (
//         <div className="flex h-screen overflow-hidden">
//             <Sidebar />
            
//             <main className="flex-1 overflow-y-auto bg-white">
//                 <div className="max-w-8xl mx-auto">
//                     <header className="flex justify-between items-center p-4">
//                         <div className="flex items-center gap-2">
//                             <div className="p-1 bg-white text-gray-400 rounded-md">
//                                 <svg height="16px" width="16px" viewBox="0 0 16 16" role="img" aria-label="ProductIcon" className="sc-fQpRED cOkelz ui-icon"><path fill="currentColor" fillRule="evenodd" d="M1.25 4A2.75 2.75 0 0 1 4 1.25h8A2.75 2.75 0 0 1 14.75 4v8A2.75 2.75 0 0 1 12 14.75H4A2.75 2.75 0 0 1 1.25 12zM4 2.75c-.69 0-1.25.56-1.25 1.25v1.25h10.5V4c0-.69-.56-1.25-1.25-1.25zm9.25 4H2.75V12c0 .69.56 1.25 1.25 1.25h8c.69 0 1.25-.56 1.25-1.25z" clipRule="evenodd"></path></svg>
//                             </div>
//                             <ProductDropdown onProductSelect={handleProductsSelect} />
//                         </div>

//                         <div className="flex items-center gap-4">
//                             <div className="relative">
//                                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                     <Search size={18} className="text-gray-400" />
//                                 </div>
//                                 <input
//                                     type="text"
//                                     placeholder="Search..."
//                                     value={searchQuery}
//                                     onChange={(e) => setSearchQuery(e.target.value)}
//                                     className="pl-10 pr-4 py-2 border border-gray-100 rounded-md w-80"
//                                 />
//                             </div>

//                             <button className="p-2 bg-white text-gray-400 rounded-md hover:bg-gray-100 transition duration-200">
//                                 <svg height="16px" width="16px" viewBox="0 0 16 16" role="img" aria-label="ImportIcon" className="sc-fQpRED bUGbIN ui-icon"><path fill="currentColor" fillRule="evenodd" d="M8 2.083a5.917 5.917 0 1 0 0 11.834A5.917 5.917 0 0 0 8 2.083M.583 8a7.417 7.417 0 1 1 14.833 0A7.417 7.417 0 0 1 .583 8m4.22-.53 2.666-2.667a.75.75 0 0 1 1.061 0l2.667 2.667a.75.75 0 1 1-1.061 1.06L8.75 7.144v3.523a.75.75 0 0 1-1.5 0V7.144L5.863 8.53a.75.75 0 0 1-1.06-1.06" clipRule="evenodd"></path></svg>
//                             </button>
//                         </div>
//                     </header>

//                     <div className="flex items-center px-6 py-2 justify-between">
//                         <button
//                             type="button"
//                             className="inline-flex items-center bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
//                         >
//                             <svg height="16" width="16" viewBox="0 0 16 16" fill="currentColor" fillRule="evenodd" className="mr-1" aria-label="PlusIcon" role="img">
//                                 <path d="M8 2.583a.75.75 0 0 1 .75.75V7.25h3.916a.75.75 0 1 1 0 1.5H8.75v3.917a.75.75 0 0 1-1.5 0V8.75H3.333a.75.75 0 1 1 0-1.5H7.25V3.333a.75.75 0 0 1 .75-.75" clipRule="evenodd" />
//                             </svg>
//                             <span>Add filter</span>
//                         </button>
//                         <button
//                             type="button"
//                             className="ml-4 inline-flex items-center justify-end bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
//                         >
//                             <svg height="16" width="16" viewBox="0 0 16 16" fill="currentColor" fillRule="evenodd" className="mr-1" aria-label="SettingsIcon" role="img">
//                                 <path d="M7.48.825a2.1 2.1 0 0 0-.665.28c-.459.286-.64.521-1.019 1.328-.3.64-.39.768-.615.873-.235.111-.323.115-1.023.043-.83-.086-1.066-.068-1.518.111a2.17 2.17 0 0 0-1.263 2.7c.092.275.175.411.588.966.196.265.377.524.4.577.058.13.058.464 0 .594a7 7 0 0 1-.4.577c-.413.555-.496.691-.588.966a2.154 2.154 0 0 0 1.056 2.599c.508.268.814.306 1.725.212.713-.073.798-.069 1.036.053.227.116.303.224.602.863.374.795.544 1.021.984 1.306.416.269.781.366 1.308.348.302-.011.388-.024.605-.096.28-.092.61-.282.821-.471.24-.216.396-.462.69-1.087.298-.636.365-.732.6-.859.216-.119.338-.125 1.05-.051.557.058.672.063.893.037.546-.064.996-.279 1.36-.652.43-.439.613-.899.615-1.535.001-.563-.136-.888-.694-1.636-.415-.557-.475-.682-.445-.938.025-.214.068-.29.458-.814.49-.66.614-.913.68-1.387a2.25 2.25 0 0 0-.222-1.239A2.2 2.2 0 0 0 13.36 3.46c-.452-.179-.688-.197-1.518-.111-.713.073-.798.069-1.036-.053-.225-.116-.303-.226-.592-.843a8 8 0 0 0-.368-.718A2.26 2.26 0 0 0 8.487.817 2.8 2.8 0 0 0 7.48.825m.758 1.457c.252.075.364.21.602.726.113.245.253.534.311.643.326.614.903 1.036 1.631 1.19.25.053.562.049 1.17-.017.283-.03.576-.049.651-.042.367.036.65.334.65.685 0 .205-.05.297-.446.828-.393.526-.504.715-.61 1.038-.068.209-.074.261-.075.654 0 .331.01.465.047.6.087.317.265.631.632 1.12.193.256.374.514.401.573.155.332-.054.779-.423.905-.159.054-.275.053-.89-.014-.827-.089-1.222-.043-1.719.202a3 3 0 0 0-.435.269c-.363.284-.507.504-.92 1.404-.15.322-.205.415-.309.512a.74.74 0 0 1-1.012 0c-.107-.101-.163-.198-.389-.682a10 10 0 0 0-.36-.714c-.41-.631-1.184-1.043-1.953-1.042a10 10 0 0 0-.725.053c-.264.029-.53.053-.593.053a.93.93 0 0 1-.5-.19c-.207-.181-.286-.518-.177-.758a7 7 0 0 1 .396-.573c.393-.526.504-.714.61-1.038.07-.211.075-.257.075-.667s-.005-.456-.075-.667c-.106-.324-.217-.512-.61-1.038-.396-.531-.445-.623-.445-.828 0-.351.282-.649.65-.685.074-.007.367.012.651.042.607.066.92.07 1.17.017.653-.139 1.196-.496 1.526-1.003.053-.082.215-.402.36-.711.295-.635.382-.749.633-.836a.75.75 0 0 1 .5-.009m-.654 3.064A2.74 2.74 0 0 0 5.33 7.36c-.05.19-.06.294-.06.64 0 .504.048.722.263 1.16.415.85 1.206 1.396 2.186 1.51a2.78 2.78 0 0 0 2.24-.792 2.63 2.63 0 0 0 .493-3.078c-.516-1.033-1.704-1.635-2.868-1.454m.814 1.505c.445.138.8.545.852.976.045.378-.05.693-.292.957-.264.288-.557.416-.958.416s-.694-.128-.958-.416a1.137 1.137 0 0 1 0-1.568c.16-.175.348-.299.552-.364.211-.068.59-.068.804-.001" clipRule="evenodd" />
//                             </svg>
//                             <span>Board controls</span>
//                         </button>
//                     </div>
//                 </div>

//                 <div className="bg-gray-100">
//                     <ProductTable selectedProductIds={selectedProductIds} />
//                 </div>
//             </main>
//         </div>
//     );
// }


// // 'use client';
// // import { useState, useEffect } from 'react';
// // import ProductTable from '@/app/(main)/(pages)/productTable/ProductTable';
// // import { Search } from 'lucide-react';
// // import ProductDropdown from '@/app/(main)/(pages)/productDropdown/ProductDropdown';
// // import Sidebar from './_components/sidebar';
// // import { FilterContainer } from '@/components/filters/filtercontainer';

// // export default function Home() {
// //     const [searchQuery, setSearchQuery] = useState('');
// //     const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
    
// //     // Filter states
// //     const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
// //     const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
// //     const [startDate, setStartDate] = useState<Date | undefined>(undefined);
// //     const [endDate, setEndDate] = useState<Date | undefined>(undefined);
    
// //     // Available filter options (these would ideally come from your data)
// //     const [availableTeams, setAvailableTeams] = useState<string[]>([
// //         'Frontend', 'Backend', 'Design', 'QA', 'DevOps'
// //     ]);
// //     const [availableStatuses, setAvailableStatuses] = useState<string[]>([
// //         'Todo', 'In Progress', 'Completed'
// //     ]);

// //     const handleProductsSelect = (productIds: string[]) => {
// //         setSelectedProductIds(productIds);
// //     };

// //     const handleTeamSelect = (teams: string[]) => {
// //         setSelectedTeams(teams);
// //     };

// //     const handleStatusSelect = (statuses: string[]) => {
// //         setSelectedStatuses(statuses);
// //     };

// //     const handleDateChange = (start: Date | undefined, end: Date | undefined) => {
// //         setStartDate(start);
// //         setEndDate(end);
// //     };

// //     const clearFilters = () => {
// //         setSelectedTeams([]);
// //         setSelectedStatuses([]);
// //         setStartDate(undefined);
// //         setEndDate(undefined);
// //     };

// //     return (
// //         <div className="flex h-screen overflow-hidden">
// //             <Sidebar />
            
// //             <main className="flex-1 overflow-y-auto bg-white">
// //                 <div className="max-w-8xl mx-auto">
// //                     <header className="flex justify-between items-center p-4">
// //                         <div className="flex items-center gap-2">
// //                             <div className="p-1 bg-white text-gray-400 rounded-md">
// //                                 <svg height="16px" width="16px" viewBox="0 0 16 16" role="img" aria-label="ProductIcon" className="sc-fQpRED cOkelz ui-icon"><path fill="currentColor" fillRule="evenodd" d="M1.25 4A2.75 2.75 0 0 1 4 1.25h8A2.75 2.75 0 0 1 14.75 4v8A2.75 2.75 0 0 1 12 14.75H4A2.75 2.75 0 0 1 1.25 12zM4 2.75c-.69 0-1.25.56-1.25 1.25v1.25h10.5V4c0-.69-.56-1.25-1.25-1.25zm9.25 4H2.75V12c0 .69.56 1.25 1.25 1.25h8c.69 0 1.25-.56 1.25-1.25z" clipRule="evenodd"></path></svg>
// //                             </div>
// //                             <ProductDropdown onProductSelect={handleProductsSelect} />
// //                         </div>

// //                         <div className="flex items-center gap-4">
// //                             <div className="relative">
// //                                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
// //                                     <Search size={18} className="text-gray-400" />
// //                                 </div>
// //                                 <input
// //                                     type="text"
// //                                     placeholder="Search..."
// //                                     value={searchQuery}
// //                                     onChange={(e) => setSearchQuery(e.target.value)}
// //                                     className="pl-10 pr-4 py-2 border border-gray-100 rounded-md w-80"
// //                                 />
// //                             </div>

// //                             <button className="p-2 bg-white text-gray-400 rounded-md hover:bg-gray-100 transition duration-200">
// //                                 <svg height="16px" width="16px" viewBox="0 0 16 16" role="img" aria-label="ImportIcon" className="sc-fQpRED bUGbIN ui-icon"><path fill="currentColor" fillRule="evenodd" d="M8 2.083a5.917 5.917 0 1 0 0 11.834A5.917 5.917 0 0 0 8 2.083M.583 8a7.417 7.417 0 1 1 14.833 0A7.417 7.417 0 0 1 .583 8m4.22-.53 2.666-2.667a.75.75 0 0 1 1.061 0l2.667 2.667a.75.75 0 1 1-1.061 1.06L8.75 7.144v3.523a.75.75 0 0 1-1.5 0V7.144L5.863 8.53a.75.75 0 0 1-1.06-1.06" clipRule="evenodd"></path></svg>
// //                             </button>
// //                         </div>
// //                     </header>

// //                     <div className="flex items-center px-6 py-2 justify-between">
// //                         <FilterContainer
// //                             selectedTeams={selectedTeams}
// //                             selectedStatuses={selectedStatuses}
// //                             startDate={startDate}
// //                             endDate={endDate}
// //                             availableTeams={availableTeams}
// //                             availableStatuses={availableStatuses}
// //                             onTeamSelect={handleTeamSelect}
// //                             onStatusSelect={handleStatusSelect}
// //                             onDateChange={handleDateChange}
// //                             onClearFilters={clearFilters}
// //                         />
// //                         <button
// //                             type="button"
// //                             className="ml-4 inline-flex items-center justify-end bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
// //                         >
// //                             <svg height="16" width="16" viewBox="0 0 16 16" fill="currentColor" fillRule="evenodd" className="mr-1" aria-label="SettingsIcon" role="img">
// //                                 <path d="M7.48.825a2.1 2.1 0 0 0-.665.28c-.459.286-.64.521-1.019 1.328-.3.64-.39.768-.615.873-.235.111-.323.115-1.023.043-.83-.086-1.066-.068-1.518.111a2.17 2.17 0 0 0-1.263 2.7c.092.275.175.411.588.966.196.265.377.524.4.577.058.13.058.464 0 .594a7 7 0 0 1-.4.577c-.413.555-.496.691-.588.966a2.154 2.154 0 0 0 1.056 2.599c.508.268.814.306 1.725.212.713-.073.798-.069 1.036.053.227.116.303.224.602.863.374.795.544 1.021.984 1.306.416.269.781.366 1.308.348.302-.011.388-.024.605-.096.28-.092.61-.282.821-.471.24-.216.396-.462.69-1.087.298-.636.365-.732.6-.859.216-.119.338-.125 1.05-.051.557.058.672.063.893.037.546-.064.996-.279 1.36-.652.43-.439.613-.899.615-1.535.001-.563-.136-.888-.694-1.636-.415-.557-.475-.682-.445-.938.025-.214.068-.29.458-.814.49-.66.614-.913.68-1.387a2.25 2.25 0 0 0-.222-1.239A2.2 2.2 0 0 0 13.36 3.46c-.452-.179-.688-.197-1.518-.111-.713.073-.798.069-1.036-.053-.225-.116-.303-.226-.592-.843a8 8 0 0 0-.368-.718A2.26 2.26 0 0 0 8.487.817 2.8 2.8 0 0 0 7.48.825m.758 1.457c.252.075.364.21.602.726.113.245.253.534.311.643.326.614.903 1.036 1.631 1.19.25.053.562.049 1.17-.017.283-.03.576-.049.651-.042.367.036.65.334.65.685 0 .205-.05.297-.446.828-.393.526-.504.715-.61 1.038-.068.209-.074.261-.075.654 0 .331.01.465.047.6.087.317.265.631.632 1.12.193.256.374.514.401.573.155.332-.054.779-.423.905-.159.054-.275.053-.89-.014-.827-.089-1.222-.043-1.719.202a3 3 0 0 0-.435.269c-.363.284-.507.504-.92 1.404-.15.322-.205.415-.309.512a.74.74 0 0 1-1.012 0c-.107-.101-.163-.198-.389-.682a10 10 0 0 0-.36-.714c-.41-.631-1.184-1.043-1.953-1.042a10 10 0 0 0-.725.053c-.264.029-.53.053-.593.053a.93.93 0 0 1-.5-.19c-.207-.181-.286-.518-.177-.758a7 7 0 0 1 .396-.573c.393-.526.504-.714.61-1.038.07-.211.075-.257.075-.667s-.005-.456-.075-.667c-.106-.324-.217-.512-.61-1.038-.396-.531-.445-.623-.445-.828 0-.351.282-.649.65-.685.074-.007.367.012.651.042.607.066.92.07 1.17.017.653-.139 1.196-.496 1.526-1.003.053-.082.215-.402.36-.711.295-.635.382-.749.633-.836a.75.75 0 0 1 .5-.009m-.654 3.064A2.74 2.74 0 0 0 5.33 7.36c-.05.19-.06.294-.06.64 0 .504.048.722.263 1.16.415.85 1.206 1.396 2.186 1.51a2.78 2.78 0 0 0 2.24-.792 2.63 2.63 0 0 0 .493-3.078c-.516-1.033-1.704-1.635-2.868-1.454m.814 1.505c.445.138.8.545.852.976.045.378-.05.693-.292.957-.264.288-.557.416-.958.416s-.694-.128-.958-.416a1.137 1.137 0 0 1 0-1.568c.16-.175.348-.299.552-.364.211-.068.59-.068.804-.001" clipRule="evenodd" />
// //                             </svg>
// //                             <span>Board controls</span>
// //                         </button>
// //                     </div>
// //                 </div>

// //                 <div className="bg-gray-100">
// //                     <ProductTable 
// //                         selectedProductIds={selectedProductIds} 
// //                         teamFilter={selectedTeams}
// //                         statusFilter={selectedStatuses}
// //                         startDateFilter={startDate}
// //                         endDateFilter={endDate}
// //                     />
// //                 </div>
// //             </main>
// //         </div>
// //     );
// // }




'use client';
import { useState, useEffect } from 'react';
import ProductTable from '@/app/(main)/(pages)/productTable/ProductTable';
import { Search } from 'lucide-react';
import ProductDropdown from '@/app/(main)/(pages)/productDropdown/ProductDropdown';
import Sidebar from './_components/sidebar';
import { supabase } from '@/lib/supabaseClient';
import { FilterContainer } from '@/components/filters/filtercontainer';

export default function Home() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
    
    // Filter states
    const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
    const [selectedVersions, setSelectedVersions] = useState<string[]>([]);
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);
    
    // Available filter options (will be fetched from database)
    const [availableTeams, setAvailableTeams] = useState<string[]>([]);
    const [availableStatuses, setAvailableStatuses] = useState<string[]>([]);
    const [availableVersions, setAvailableVersions] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch filter options from database
    useEffect(() => {
        async function fetchFilterOptions() {
            setIsLoading(true);
            try {
                // Fetch unique team values from database
                const { data: teamData, error: teamError } = await supabase
                    .from('features')
                    .select('team')
                    .not('team', 'is', null);
                
                if (teamError) throw teamError;

                const teams = new Set(teamData.map(item => item.team).filter(Boolean));
                setAvailableTeams(Array.from(teams) as string[]);
                
                // Fetch unique status values from database
                const { data: statusData, error: statusError } = await supabase
                    .from('features')
                    .select('status')
                    .not('status', 'is', null);
                
                if (statusError) throw statusError;

                const statuses = new Set(statusData.map(item => item.status).filter(Boolean));
                setAvailableStatuses(Array.from(statuses) as string[]);

                // Fetch versions from database
                const { data: versionData, error: versionError } = await supabase
                    .from('versions')
                    .select('version')
                    .order('version', { ascending: true });
                
                if (versionError) throw versionError;

                const versions = versionData.map(item => item.version);
                setAvailableVersions(versions);
            } catch (error) {
                console.error("Error fetching filter options:", error);
            } finally {
                setIsLoading(false);
            }
        }
        
        fetchFilterOptions();
    }, []);

    const handleProductsSelect = (productIds: string[]) => {
        setSelectedProductIds(productIds);
    };

    const handleTeamSelect = (teams: string[]) => {
        setSelectedTeams(teams);
    };

    const handleStatusSelect = (statuses: string[]) => {
        setSelectedStatuses(statuses);
    };

    const handleVersionSelect = (versions: string[]) => {
        setSelectedVersions(versions);
    };

    const handleDateChange = (start: Date | undefined, end: Date | undefined) => {
        setStartDate(start);
        setEndDate(end);
    };

    const clearFilters = () => {
        setSelectedTeams([]);
        setSelectedStatuses([]);
        setSelectedVersions([]);
        setStartDate(undefined);
        setEndDate(undefined);
    };

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto bg-white">
                <div className="max-w-8xl mx-auto">
                    {/* Sticky header with only the product icon and dropdown */}
                    <header className="flex justify-between items-center p-4 bg-white">
                        <div className="flex items-center gap-2">
                            <div className="p-1 bg-white text-gray-400 rounded-md">
                                <svg height="16px" width="16px" viewBox="0 0 16 16" role="img" aria-label="ProductIcon" className="sc-fQpRED cOkelz ui-icon"><path fill="currentColor" fillRule="evenodd" d="M1.25 4A2.75 2.75 0 0 1 4 1.25h8A2.75 2.75 0 0 1 14.75 4v8A2.75 2.75 0 0 1 12 14.75H4A2.75 2.75 0 0 1 1.25 12zM4 2.75c-.69 0-1.25.56-1.25 1.25v1.25h10.5V4c0-.69-.56-1.25-1.25-1.25zm9.25 4H2.75V12c0 .69.56 1.25 1.25 1.25h8c.69 0 1.25-.56 1.25-1.25z" clipRule="evenodd"></path></svg>
                            </div>
                            <ProductDropdown onProductSelect={handleProductsSelect} />
                        </div>
                    </header>

                    {/* Filter bar (no right-side controls) */}
                    <div className="flex items-center px-6 py-2">
                        <FilterContainer
                            selectedTeams={selectedTeams}
                            selectedStatuses={selectedStatuses}
                            selectedVersions={selectedVersions}
                            startDate={startDate}
                            endDate={endDate}
                            availableTeams={availableTeams}
                            availableStatuses={availableStatuses}
                            availableVersions={availableVersions}
                            onTeamSelect={handleTeamSelect}
                            onStatusSelect={handleStatusSelect}
                            onVersionSelect={handleVersionSelect}
                            onDateChange={handleDateChange}
                            onClearFilters={clearFilters}
                        />
                    </div>
                </div>

                <div className="bg-gray-100">
                    <ProductTable 
                        selectedProductIds={selectedProductIds}
                        teamFilter={selectedTeams}
                        statusFilter={selectedStatuses}
                        versionFilter={selectedVersions}
                        startDateFilter={startDate}
                        endDateFilter={endDate}
                    />
                </div>
            </main>
        </div>
    );
}
