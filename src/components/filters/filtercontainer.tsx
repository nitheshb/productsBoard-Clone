
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TeamFilter } from './TeamFilter';
import { TeamMember } from '@/utils/teamUtils';
import { fetchExistingTeamMembers } from '@/utils/teamUtils';
import { StatusFilter } from './StatusFilter';
import { VersionFilter } from './VersionFilter';
import { TaskTypeFilter } from './TaskTypeFilter';
import { DateFilter } from './DateFilter';

interface FilterContainerProps {
  selectedTeams: Array<string | TeamMember>;
  selectedStatuses: string[];
  selectedVersions: string[];
  selectedTaskTypes: string[];
  startDate: Date | undefined;
  endDate: Date | undefined;
  availableTeams: Array<string | TeamMember>;
  availableStatuses: string[];
  availableVersions: string[];
  availableTaskTypes: string[];
  onTeamSelect: (teams: Array<string | TeamMember>) => void;
  onStatusSelect: (statuses: string[]) => void;
  onVersionSelect: (versions: string[]) => void;
  onTaskTypeSelect: (taskTypes: string[]) => void;
  onDateChange: (start: Date | undefined, end: Date | undefined) => void;
  onClearFilters: () => void;
}

export const FilterContainer: React.FC<FilterContainerProps> = ({
  selectedTeams,
  selectedStatuses,
  selectedVersions,
  selectedTaskTypes,
  startDate,
  endDate,
  availableTeams,
  availableStatuses,
  availableVersions,
  availableTaskTypes,
  onTeamSelect,
  onStatusSelect,
  onVersionSelect,
  onTaskTypeSelect,
  onDateChange,
  onClearFilters,
}) => {
  const [localAvailableTeams, setLocalAvailableTeams] = useState<Array<string | TeamMember>>(availableTeams || []);

  // If parent didn't supply availableTeams, or it's empty, fetch from pb_employees
  useEffect(() => {
    let mounted = true;
    const shouldFetch = !availableTeams || availableTeams.length === 0;
    if (shouldFetch) {
      fetchExistingTeamMembers().then(list => {
        if (mounted) setLocalAvailableTeams(list);
      }).catch(err => console.error('Error fetching teams for filters:', err));
    } else {
      setLocalAvailableTeams(availableTeams);
    }
    return () => { mounted = false; };
  }, [availableTeams]);
  const hasActiveFilters = selectedTeams.length > 0 || 
                          selectedStatuses.length > 0 || 
                          selectedVersions.length > 0 || 
                          selectedTaskTypes.length > 0 ||
                          startDate || 
                          endDate;

  return (
    <div className="flex flex-col gap-4">
      {/* Filter Controls */}
      <div className="flex flex-wrap gap-3 items-center">
        <TeamFilter
          selectedTeams={selectedTeams}
          availableTeams={localAvailableTeams}
          onTeamSelect={onTeamSelect}
        />

        <StatusFilter
          selectedStatuses={selectedStatuses}
          onStatusSelect={onStatusSelect}
        />

        <VersionFilter
          selectedVersions={selectedVersions}
          availableVersions={availableVersions}
          onVersionSelect={onVersionSelect}
        />

        <DateFilter
          startDate={startDate}
          endDate={endDate}
          onDateSelect={onDateChange}
        />

        <TaskTypeFilter
          selectedTaskTypes={selectedTaskTypes}
          availableTaskTypes={availableTaskTypes}
          onTaskTypeSelect={onTaskTypeSelect}
        />

        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            onClick={onClearFilters} 
            size="sm"
            className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            Clear All Filters
          </Button>
        )}
      </div>

      {/* Active Filter Badges */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <span className="text-sm font-medium text-gray-700 mr-2">Active Filters:</span>
          
          {selectedTeams.map(team => {
            const displayName = typeof team === 'string' ? team : team.name;
            const key = typeof team === 'string' ? team : (team.id || team.name);
            const remove = () => {
              const filtered = selectedTeams.filter(t => {
                if (typeof t === 'string' && typeof team === 'string') return t !== team;
                if (typeof t === 'string' && typeof team !== 'string') return t !== team.name;
                if (typeof t !== 'string' && typeof team === 'string') return t.name !== team;
                // both objects
                if (typeof t !== 'string' && typeof team !== 'string') {
                  if (t.id && team.id) return t.id !== team.id;
                  return t.name !== team.name;
                }
                return true;
              });
              onTeamSelect(filtered);
            };

            return (
              <Badge key={key} variant="secondary" className="text-xs bg-blue-100 text-blue-800 hover:bg-blue-200">
                <span className="mr-1">👥</span>
                {displayName}
                <button 
                  onClick={remove}
                  className="ml-1 rounded-full hover:bg-blue-300 h-4 w-4 flex items-center justify-center transition-colors"
                >
                  ×
                </button>
              </Badge>
            );
          })}
          
          {selectedStatuses.map(status => (
            <Badge key={status} variant="secondary" className="text-xs bg-green-100 text-green-800 hover:bg-green-200">
              <span className="mr-1">📊</span>
              {status}
              <button 
                onClick={() => onStatusSelect(selectedStatuses.filter(s => s !== status))}
                className="ml-1 rounded-full hover:bg-green-300 h-4 w-4 flex items-center justify-center transition-colors"
              >
                ×
              </button>
            </Badge>
          ))}
          
          {selectedVersions.map(version => (
            <Badge key={version} variant="secondary" className="text-xs bg-purple-100 text-purple-800 hover:bg-purple-200">
              <span className="mr-1">🌐</span>
              {version}
              <button 
                onClick={() => onVersionSelect(selectedVersions.filter(v => v !== version))}
                className="ml-1 rounded-full hover:bg-purple-300 h-4 w-4 flex items-center justify-center transition-colors"
              >
                ×
              </button>
            </Badge>
          ))}

          {selectedTaskTypes.map(taskType => (
            <Badge key={taskType} variant="secondary" className="text-xs bg-indigo-100 text-indigo-800 hover:bg-indigo-200">
              <span className="mr-1">🏷️</span>
              {taskType}
              <button 
                onClick={() => onTaskTypeSelect(selectedTaskTypes.filter(t => t !== taskType))}
                className="ml-1 rounded-full hover:bg-indigo-300 h-4 w-4 flex items-center justify-center transition-colors"
              >
                ×
              </button>
            </Badge>
          ))}

          
          {(startDate || endDate) && (
            <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800 hover:bg-orange-200">
              <span className="mr-1">📅</span>
              {startDate && endDate ? (
                <span>
                  {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
                </span>
              ) : startDate ? (
                <span>From {startDate.toLocaleDateString()}</span>
              ) : endDate && (
                <span>Until {endDate.toLocaleDateString()}</span>
              )}
              <button 
                onClick={() => onDateChange(undefined, undefined)}
                className="ml-1 rounded-full hover:bg-orange-300 h-4 w-4 flex items-center justify-center transition-colors"
              >
                ×
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};