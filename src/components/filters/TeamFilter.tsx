
import React, { useState, useEffect } from "react";
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

interface TeamFilterProps {
  selectedTeams: string[];
  onTeamSelect: (teams: string[]) => void;
  availableTeams: string[];
}

export function TeamFilter({ selectedTeams, onTeamSelect, availableTeams }: TeamFilterProps) {
  const [customTeam, setCustomTeam] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleTeamToggle = (team: string) => {
    const updatedTeams = selectedTeams.includes(team) 
      ? selectedTeams.filter((t) => t !== team)
      : [...selectedTeams, team];

    onTeamSelect(updatedTeams);
  };

  const handleAddCustomTeam = () => {
    if (customTeam.trim() && !availableTeams.includes(customTeam)) {
      onTeamSelect([...selectedTeams, customTeam]);
      setCustomTeam("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddCustomTeam();
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1 bg-white hover:bg-gray-50 border-gray-300">
          <Users className="h-4 w-4" />
          Team {selectedTeams.length > 0 && `(${selectedTeams.length})`}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64 max-h-80 overflow-y-auto bg-white">
        <DropdownMenuLabel className="px-3 py-2 text-sm font-medium text-gray-700 border-b border-gray-200">
          Select Teams
        </DropdownMenuLabel>
        
        <div className="p-3 border-b border-gray-200">
          <div className="flex gap-2">
            <Input
              value={customTeam}
              onChange={(e) => setCustomTeam(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add team name"
              className="h-8 text-sm"
            />
            <Button
              size="sm"
              variant="secondary"
              className="h-8 px-2"
              onClick={handleAddCustomTeam}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        <div className="max-h-48 overflow-y-auto">
          {availableTeams.map((team) => (
            <DropdownMenuCheckboxItem
              key={team}
              checked={selectedTeams.includes(team)}
              onSelect={(e) => {
                e.preventDefault();
                handleTeamToggle(team);
              }}
              className="px-3 py-2 text-sm"
            >
              {team}
            </DropdownMenuCheckboxItem>
          ))}
          
          {selectedTeams.map(team => 
            !availableTeams.includes(team) && (
              <DropdownMenuCheckboxItem
                key={team}
                checked={true}
                onSelect={(e) => {
                  e.preventDefault();
                  handleTeamToggle(team);
                }}
                className="px-3 py-2 text-sm text-blue-600"
              >
                {team} (custom)
              </DropdownMenuCheckboxItem>
            )
          )}
        </div>
        
        {selectedTeams.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="p-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onTeamSelect([])}
                className="w-full text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Clear All
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}