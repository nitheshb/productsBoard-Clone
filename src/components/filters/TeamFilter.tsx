
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
  const [isOpen, setIsOpen] = useState(false);

  const handleTeamToggle = (team: string) => {
    const updatedTeams = selectedTeams.includes(team) 
      ? selectedTeams.filter((t) => t !== team)
      : [...selectedTeams, team];

    onTeamSelect(updatedTeams);
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
        
        <div className="max-h-48 overflow-y-auto">
          {availableTeams.map((team) => (
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
            !availableTeams.includes(team) && (
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
