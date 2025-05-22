
import React, { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
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

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1 bg-white">
          Team {selectedTeams.length > 0 && `(${selectedTeams.length})`}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64 bg-white p-2">
        <div className="mb-2 flex gap-2">
          <Input
            value={customTeam}
            onChange={(e) => setCustomTeam(e.target.value)}
            placeholder="Add team name"
            className="h-8"
          />
          <Button
            size="sm"
            variant="secondary"
            className="h-8 px-2"
            onClick={handleAddCustomTeam}
          >
            Add
          </Button>
        </div>
        
        {availableTeams.map((team) => (
          <DropdownMenuCheckboxItem
            key={team}
            checked={selectedTeams.includes(team)}
            onSelect={(e) => {
              e.preventDefault();
              handleTeamToggle(team);
            }}
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
            >
              {team} (custom)
            </DropdownMenuCheckboxItem>
          )
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}