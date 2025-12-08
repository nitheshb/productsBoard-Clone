
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
import { fetchExistingTeamMembers, teamEventEmitter, addTeamMemberToCache, addTeamMember, TeamMember } from '@/utils/teamUtils';

interface TeamFilterProps {
  selectedTeams: Array<string | TeamMember>;
  onTeamSelect: (teams: Array<string | TeamMember>) => void;
  availableTeams: Array<string | TeamMember>;
}

export function TeamFilter({ selectedTeams, onTeamSelect, availableTeams }: TeamFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localTeams, setLocalTeams] = useState<Array<string | TeamMember>>(availableTeams);
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
        // If prev already contains this name (string or object), skip
        const exists = prev.some(t => (typeof t === 'string' ? t === teamName : t.name === teamName));
        if (!exists) {
          return [...prev, teamName];
        }
        return prev;
      });
    });

    return unsubscribe;
  }, []);

  const handleTeamToggle = (team: string | TeamMember) => {
    // Normalize selection by name or id
    const teamKey = typeof team === 'string' ? team : (team.id || team.name);

    const isSelected = selectedTeams.some(t => {
      if (typeof t === 'string') return t === teamKey;
      return (t.id && teamKey === t.id) || t.name === teamKey;
    });

    const updatedTeams = isSelected ? [] : [team];
    onTeamSelect(updatedTeams);
  };

  const handleAddNewTeam = async () => {
    if (newTeamName.trim()) {
      const trimmedName = newTeamName.trim();

      // Add to cache immediately for real-time updates
      addTeamMemberToCache(trimmedName);

      // Update local teams list (as string for now)
      setLocalTeams(prev => {
        const exists = prev.some(t => (typeof t === 'string' ? t === trimmedName : t.name === trimmedName));
        if (!exists) {
          return [...prev, trimmedName];
        }
        return prev;
      });

      // Add to selected teams
      const alreadySelected = selectedTeams.some(t => (typeof t === 'string' ? t === trimmedName : t.name === trimmedName));
      if (!alreadySelected) {
        onTeamSelect([...selectedTeams, trimmedName]);
      }
      setNewTeamName('');

      // Persist to pb_employees asynchronously; if it returns an id, update local list and selection
      try {
        const result = await addTeamMember(trimmedName);
        if (result) {
          // Replace string entry with object that includes id
          setLocalTeams(prev => prev.map(t => (typeof t === 'string' && t === trimmedName ? result : t)));
          // Update selectedTeams to carry id as well
          const newSelection = selectedTeams.map(t => (typeof t === 'string' && t === trimmedName ? result : t));
          onTeamSelect(newSelection);
        }
      } catch (err) {
        console.error('Error persisting new team member:', err);
      }
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
            {selectedTeams.length > 0 ? (typeof selectedTeams[0] === 'string' ? selectedTeams[0] : selectedTeams[0].name) : "Select Team"}
          </span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64 max-h-80 overflow-y-auto bg-white">
        <DropdownMenuLabel className="px-3 py-2 text-sm font-medium text-gray-700 border-b border-gray-200">
          Select Teams
        </DropdownMenuLabel>
        
        <div className="max-h-48 overflow-y-auto">
          {localTeams.map((team) => {
            const teamKey = typeof team === 'string' ? team : (team.id || team.name);
            const displayName = typeof team === 'string' ? team : team.name;
            const isChecked = selectedTeams.some(t => (typeof t === 'string' ? t === teamKey : (t.id ? t.id === teamKey : t.name === teamKey)));
            return (
              <DropdownMenuCheckboxItem
                key={teamKey}
                checked={isChecked}
                onSelect={(e) => {
                  e.preventDefault();
                  handleTeamToggle(team);
                }}
                className="px-3 py-2 text-sm pl-8"
              >
                {displayName}
              </DropdownMenuCheckboxItem>
            );
          })}
          
          {selectedTeams.map(team => {
            const teamKey = typeof team === 'string' ? team : (team.id || team.name);
            const existsInLocal = localTeams.some(t => (typeof t === 'string' ? t === teamKey : (t.id ? t.id === teamKey : t.name === teamKey)));
            if (existsInLocal) return null;
            const displayName = typeof team === 'string' ? team : team.name;
            return (
              <DropdownMenuCheckboxItem
                key={teamKey}
                checked={true}
                onSelect={(e) => {
                  e.preventDefault();
                  handleTeamToggle(team);
                }}
                className="px-3 py-2 text-sm text-blue-600 pl-8"
              >
                {displayName} (custom)
              </DropdownMenuCheckboxItem>
            );
          })}
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
