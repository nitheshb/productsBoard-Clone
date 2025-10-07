
import React, { useState, useEffect, useRef } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Users, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { fetchExistingTeamMembers, teamEventEmitter, addTeamMemberToCache } from '@/utils/teamUtils';

interface TeamFilterProps {
  selectedTeams: string[];
  onTeamSelect: (teams: string[]) => void;
  availableTeams: string[];
}

export function TeamFilter({ selectedTeams, onTeamSelect, availableTeams }: TeamFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localTeams, setLocalTeams] = useState<string[]>(availableTeams);
  const [newTeamName, setNewTeamName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Update local teams when availableTeams prop changes
  useEffect(() => {
    setLocalTeams(availableTeams);
  }, [availableTeams]);

  // Listen for team member updates
  useEffect(() => {
    const unsubscribe = teamEventEmitter.subscribe((teamName: string) => {
      setLocalTeams(prev => {
        if (!prev.includes(teamName)) {
          return [...prev, teamName];
        }
        return prev;
      });
    });

    return unsubscribe;
  }, []);

  const handleTeamToggle = (team: string) => {
    // For single selection: if the team is already selected, deselect it; otherwise, select only this team
    const updatedTeams = selectedTeams.includes(team) 
      ? [] // Deselect if already selected
      : [team]; // Select only this team (single selection)

    onTeamSelect(updatedTeams);
  };

  const handleAddNewTeam = () => {
    if (newTeamName.trim()) {
      const trimmedName = newTeamName.trim();
      
      // Add to cache immediately for real-time updates
      addTeamMemberToCache(trimmedName);
      
      // Update local teams list
      setLocalTeams(prev => {
        if (!prev.includes(trimmedName)) {
          return [...prev, trimmedName];
        }
        return prev;
      });
      
      // Add to selected teams
      if (!selectedTeams.includes(trimmedName)) {
        onTeamSelect([...selectedTeams, trimmedName]);
      }
      
      setNewTeamName('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddNewTeam();
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setNewTeamName('');
    }
  };

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1 bg-white hover:bg-gray-50 border-gray-300 w-full min-w-[120px] max-w-[140px]">
          <Users className="h-4 w-4" />
          <span className="truncate">
            {selectedTeams.length > 0 ? selectedTeams[0] : "Select Team"}
          </span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64 max-h-80 overflow-y-auto bg-white">
        <DropdownMenuLabel className="px-3 py-2 text-sm font-medium text-gray-700 border-b border-gray-200">
          Select Teams
        </DropdownMenuLabel>
        
        <div className="max-h-48 overflow-y-auto">
          {localTeams.map((team) => (
            <DropdownMenuCheckboxItem
              key={team}
              checked={selectedTeams.includes(team)}
              onSelect={(e) => {
                e.preventDefault();
                handleTeamToggle(team);
              }}
              className="px-3 py-2 text-sm pl-8"
            >
              {team}
            </DropdownMenuCheckboxItem>
          ))}
          
          {selectedTeams.map(team => 
            !localTeams.includes(team) && (
              <DropdownMenuCheckboxItem
                key={team}
                checked={true}
                onSelect={(e) => {
                  e.preventDefault();
                  handleTeamToggle(team);
                }}
                className="px-3 py-2 text-sm text-blue-600 pl-8"
              >
                {team} (custom)
              </DropdownMenuCheckboxItem>
            )
          )}
        </div>

        {/* Add New Team Member */}
        <div className="p-2 border-t border-gray-200">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type to add new team member"
              className="w-full px-3 py-2 pr-8 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {newTeamName.trim() && (
              <button
                type="button"
                onClick={handleAddNewTeam}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                title={`Add "${newTeamName.trim()}"`}
              >
                <Plus className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
