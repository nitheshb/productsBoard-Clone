'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Plus, User } from 'lucide-react';
import { fetchExistingTeamMembers, addTeamMemberToCache, TeamMember } from '@/utils/teamUtils';
import { teamEventEmitter } from '@/utils/teamEventEmitter';

interface TeamDropdownProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function TeamDropdown({
  value,
  onChange,
  placeholder = "Select or add team member",
  className = "",
  disabled = false
}: TeamDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch team members when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetchExistingTeamMembers()
        .then(members => {
          setTeamMembers(members);
        })
        .catch(error => {
          console.error('Error fetching team members:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen]);

  // Listen for team member updates
  useEffect(() => {
    const unsubscribe = teamEventEmitter.subscribe((teamName) => {
      // Update local state when a new team member is added
      setTeamMembers(prev => {
        const existingMember = prev.find(member => member.name === teamName);
        if (existingMember) {
          existingMember.count += 1;
        } else {
          prev.push({ name: teamName, count: 1 });
        }
        return [...prev].sort((a, b) => b.count - a.count);
      });
    });

    return unsubscribe;
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setNewTeamName('');
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Focus input when showing add new
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelectTeam = (teamName: string) => {
    onChange(teamName);
    setIsOpen(false);
    setNewTeamName('');
  };

  const handleAddNewTeam = () => {
    if (newTeamName.trim()) {
      const trimmedName = newTeamName.trim();
      
      // Add to cache immediately for real-time updates
      addTeamMemberToCache(trimmedName);
      
      // Update the local state immediately
      setTeamMembers(prev => {
        const existingMember = prev.find(member => member.name === trimmedName);
        if (existingMember) {
          existingMember.count += 1;
        } else {
          prev.push({ name: trimmedName, count: 1 });
        }
        return [...prev].sort((a, b) => b.count - a.count);
      });
      
      onChange(trimmedName);
      setIsOpen(false);
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

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full h-[32px] px-3 py-2 text-left text-sm border border-gray-300 rounded-md
          bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500
          disabled:bg-gray-100 disabled:cursor-not-allowed
          flex items-center justify-between
        `}
      >
        <span className={value ? 'text-gray-900' : 'text-gray-500'}>
          {value || placeholder}
        </span>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {loading ? (
            <div className="px-3 py-2 text-sm text-gray-500 flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              Loading team members...
            </div>
          ) : (
            <>
              {/* Existing Team Members */}
              {teamMembers.length > 0 && (
                <div className="py-1">
                  {teamMembers.map((member, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSelectTeam(member.name)}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        <span>{member.name}</span>
                      </div>
                      <span className="text-xs text-gray-500">({member.count})</span>
                    </button>
                  ))}
                </div>
              )}

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
            </>
          )}
        </div>
      )}
    </div>
  );
}
