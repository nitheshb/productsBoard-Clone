
'use client';
import { useState, useEffect } from 'react';
import ProductTable from '@/app/(main)/(pages)/productTable/ProductTable';
import { Search } from 'lucide-react';
import ProductDropdown from '@/app/(main)/(pages)/productDropdown/ProductDropdown';
import Sidebar from './_components/sidebar';
import { supabase } from '@/lib/supabaseClient';
import { FilterContainer } from '@/components/filters/filtercontainer';
import { fetchExistingTeamMembers, teamEventEmitter, TeamMember } from '@/utils/teamUtils';
import { ProductTableSkeleton } from '@/components/ui/ProductTableSkeleton';

export default function Home() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
    
    // Filter states
    const [selectedTeams, setSelectedTeams] = useState<Array<string | TeamMember>>([]);
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
    const [selectedVersions, setSelectedVersions] = useState<string[]>([]);
    const [selectedTaskTypes, setSelectedTaskTypes] = useState<string[]>([]);
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);
    
    // Available filter options (will be fetched from database)
    const [availableTeams, setAvailableTeams] = useState<Array<string | TeamMember>>([]);
    const [availableStatuses, setAvailableStatuses] = useState<string[]>([]);
    const [availableVersions, setAvailableVersions] = useState<string[]>([]);
    const [availableTaskTypes, setAvailableTaskTypes] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Cache for filter options (5 minute expiry)
    const CACHE_KEY = 'productFilters';
    const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

    // Fetch filter options from database - optimized with caching and parallel queries
    useEffect(() => {
        async function fetchFilterOptions() {
            setIsLoading(true);

            // Check cache first
            const cached = localStorage.getItem(CACHE_KEY);
            if (cached) {
                try {
                    const { data, timestamp } = JSON.parse(cached);
                    if (Date.now() - timestamp < CACHE_EXPIRY) {
                        setAvailableTeams(data.teams);
                        setAvailableStatuses(data.statuses);
                        setAvailableVersions(data.versions);
                        setAvailableTaskTypes(data.taskTypes);
                        setIsLoading(false);
                        return;
                    }
                } catch (e) {
                    // Invalid cache, continue with fetch
                }
            }

            try {
                // Use Promise.all for parallel queries to reduce loading time
                const [teamMembers, statusResult, versionResult] = await Promise.all([
                    fetchExistingTeamMembers(),
                    supabase.from('pb_features').select('status').not('status', 'is', null),
                    supabase.from('pb_versions').select('version').order('version', { ascending: true })
                ]);

                // Process team members
                setAvailableTeams(teamMembers);

                // Process statuses
                if (statusResult.error) throw statusResult.error;
                const statuses = new Set(statusResult.data.map(item => item.status).filter(Boolean));
                setAvailableStatuses(Array.from(statuses) as string[]);

                // Process versions
                if (versionResult.error) throw versionResult.error;
                const versions = versionResult.data.map(item => item.version);
                setAvailableVersions(versions);

                // Use predefined task types (no database query needed)
                const mainTaskTypes = ['Development', 'Testing'];
                setAvailableTaskTypes(mainTaskTypes);

                // Cache the results
                const cacheData = {
                    teams: teamMembers,
                    statuses: Array.from(statuses) as string[],
                    versions,
                    taskTypes: mainTaskTypes,
                    timestamp: Date.now()
                };
                localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));

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
                const exists = prev.some(t => (typeof t === 'string' ? t === teamName : t.name === teamName));
                if (!exists) {
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

    const handleTeamSelect = (teams: Array<string | TeamMember>) => {
        setSelectedTeams(teams);
    };

    const handleStatusSelect = (statuses: string[]) => {
        setSelectedStatuses(statuses);
    };

    const handleVersionSelect = (versions: string[]) => {
        setSelectedVersions(versions);
    };

    const handleTaskTypeSelect = (taskTypes: string[]) => {
        setSelectedTaskTypes(taskTypes);
    };

    const handleDateChange = (start: Date | undefined, end: Date | undefined) => {
        setStartDate(start);
        setEndDate(end);
    };

    const clearFilters = () => {
        setSelectedTeams([]);
        setSelectedStatuses([]);
        setSelectedVersions([]);
        setSelectedTaskTypes([]);
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
                            selectedTaskTypes={selectedTaskTypes}
                            startDate={startDate}
                            endDate={endDate}
                            availableTeams={availableTeams}
                            availableStatuses={availableStatuses}
                            availableVersions={availableVersions}
                            availableTaskTypes={availableTaskTypes}
                            onTeamSelect={handleTeamSelect}
                            onStatusSelect={handleStatusSelect}
                            onVersionSelect={handleVersionSelect}
                            onTaskTypeSelect={handleTaskTypeSelect}
                            onDateChange={handleDateChange}
                            onClearFilters={clearFilters}
                        />
                    </div>
                </div>

                <div className="bg-gray-100">
                    {isLoading ? (
                        <ProductTableSkeleton />
                    ) : (
                        <ProductTable
                            selectedProductIds={selectedProductIds}
                            teamFilter={selectedTeams.map(team => typeof team === 'string' ? team : team.name)}
                            statusFilter={selectedStatuses}
                            versionFilter={selectedVersions}
                            taskTypeFilter={selectedTaskTypes}
                            startDateFilter={startDate}
                            endDateFilter={endDate}
                        />
                    )}
                </div>
            </main>
        </div>
    );
}
