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
import { ChevronDown, Globe, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";

interface VersionFilterProps {
  selectedVersions: string[];
  onVersionSelect: (versions: string[]) => void;
  availableVersions: string[];
}

export function VersionFilter({ selectedVersions, onVersionSelect, availableVersions }: VersionFilterProps) {
  const [customVersion, setCustomVersion] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleVersionToggle = (version: string) => {
    const updatedVersions = selectedVersions.includes(version) 
      ? selectedVersions.filter((v) => v !== version)
      : [...selectedVersions, version];

    onVersionSelect(updatedVersions);
  };

  const handleAddCustomVersion = () => {
    if (customVersion.trim() && !availableVersions.includes(customVersion)) {
      onVersionSelect([...selectedVersions, customVersion]);
      setCustomVersion("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddCustomVersion();
    }
  };

  // Sort versions in semantic order (1.0.0, 1.1.0, 2.0.0, etc.)
  const sortedVersions = [...availableVersions].sort((a, b) => {
    const aParts = a.split('.').map(Number);
    const bParts = b.split('.').map(Number);
    
    for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
      const aPart = aParts[i] || 0;
      const bPart = bParts[i] || 0;
      if (aPart !== bPart) {
        return aPart - bPart;
      }
    }
    return 0;
  });

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1 bg-white hover:bg-gray-50 border-gray-300">
          <Globe className="h-4 w-4" />
          Version {selectedVersions.length > 0 && `(${selectedVersions.length})`}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64 max-h-80 overflow-y-auto bg-white">
        <DropdownMenuLabel className="px-3 py-2 text-sm font-medium text-gray-700 border-b border-gray-200">
          Select Versions
        </DropdownMenuLabel>
        
        <div className="p-3 border-b border-gray-200">
          <div className="flex gap-2">
            <Input
              value={customVersion}
              onChange={(e) => setCustomVersion(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add version (e.g., 1.0.0)"
              className="h-8 text-sm"
            />
            <Button
              size="sm"
              variant="secondary"
              className="h-8 px-2"
              onClick={handleAddCustomVersion}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        <div className="max-h-48 overflow-y-auto">
          {sortedVersions.map((version) => (
            <DropdownMenuCheckboxItem
              key={version}
              checked={selectedVersions.includes(version)}
              onSelect={(e) => {
                e.preventDefault();
                handleVersionToggle(version);
              }}
              className="px-3 py-2 text-sm"
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                  {version}
                </span>
              </div>
            </DropdownMenuCheckboxItem>
          ))}
          
          {selectedVersions.map(version => 
            !availableVersions.includes(version) && (
              <DropdownMenuCheckboxItem
                key={version}
                checked={true}
                onSelect={(e) => {
                  e.preventDefault();
                  handleVersionToggle(version);
                }}
                className="px-3 py-2 text-sm text-blue-600"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs bg-blue-100 px-2 py-1 rounded">
                    {version}
                  </span>
                  <span className="text-xs">(custom)</span>
                </div>
              </DropdownMenuCheckboxItem>
            )
          )}
        </div>
        
        {selectedVersions.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="p-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onVersionSelect([])}
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