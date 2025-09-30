
'use client';
import { useState, useEffect } from 'react';
import ProductTable from '@/app/(main)/(pages)/productTable/ProductTable';
import { Search } from 'lucide-react';
import ProductDropdown from '@/app/(main)/(pages)/productDropdown/ProductDropdown';
import Sidebar from './_components/sidebar';
import { supabase } from '@/lib/supabaseClient';
import { FilterContainer } from '@/components/filters/filtercontainer';
import { fetchExistingTeamMembers, teamEventEmitter } from '@/utils/teamUtils';

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
                // Fetch team members using the real-time system
                const teamMembers = await fetchExistingTeamMembers();
                setAvailableTeams(teamMembers.map(member => member.name));
                
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

    // Listen for team member updates
    useEffect(() => {
        const unsubscribe = teamEventEmitter.subscribe((teamName: string) => {
            setAvailableTeams(prev => {
                if (!prev.includes(teamName)) {
                    return [...prev, teamName];
                }
                return prev;
            });
        });

        return unsubscribe;
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
