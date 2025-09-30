import { supabase } from '@/lib/supabaseClient';
import { teamEventEmitter } from './teamEventEmitter';

// Re-export teamEventEmitter for external use
export { teamEventEmitter };

export interface TeamMember {
  name: string;
  count: number; // How many times this team member appears
}

// Global cache for team members
let teamMembersCache: TeamMember[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 30000; // 30 seconds

/**
 * Clear the team members cache
 */
export function clearTeamMembersCache(): void {
  teamMembersCache = null;
  cacheTimestamp = 0;
}

/**
 * Add a new team member to the cache immediately
 */
export function addTeamMemberToCache(teamName: string): void {
  if (!teamMembersCache) return;
  
  const existingMember = teamMembersCache.find(member => member.name === teamName);
  if (existingMember) {
    existingMember.count += 1;
  } else {
    teamMembersCache.push({ name: teamName, count: 1 });
  }
  
  // Sort by count (most used first)
  teamMembersCache.sort((a, b) => b.count - a.count);
  
  // Emit event to notify all listeners
  teamEventEmitter.emit(teamName);
}

/**
 * Fetch all unique team members from the database
 */
export async function fetchExistingTeamMembers(forceRefresh = false): Promise<TeamMember[]> {
  const now = Date.now();
  
  // Return cached data if it's still valid and not forcing refresh
  if (!forceRefresh && teamMembersCache && (now - cacheTimestamp) < CACHE_DURATION) {
    return teamMembersCache;
  }

  try {
    // Get unique team members from all tables that have team field
    const [productsResult, componentsResult, featuresResult] = await Promise.all([
      supabase.from('products').select('team').not('team', 'is', null),
      supabase.from('components').select('team').not('team', 'is', null),
      supabase.from('features').select('team').not('team', 'is', null)
    ]);

    // Combine all team members
    const allTeams: string[] = [];
    
    if (productsResult.data) {
      allTeams.push(...productsResult.data.map(p => p.team).filter(Boolean));
    }
    if (componentsResult.data) {
      allTeams.push(...componentsResult.data.map(c => c.team).filter(Boolean));
    }
    if (featuresResult.data) {
      allTeams.push(...featuresResult.data.map(f => f.team).filter(Boolean));
    }

    // Count occurrences and create unique list
    const teamCounts: Record<string, number> = {};
    allTeams.forEach(team => {
      teamCounts[team] = (teamCounts[team] || 0) + 1;
    });

    // Convert to array and sort by count (most used first)
    const teamMembers: TeamMember[] = Object.entries(teamCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    // Update cache
    teamMembersCache = teamMembers;
    cacheTimestamp = now;

    return teamMembers;
  } catch (error) {
    console.error('Error fetching team members:', error);
    return teamMembersCache || [];
  }
}

/**
 * Add a new team member to the database (this could be used for future team management)
 */
export async function addTeamMember(teamName: string): Promise<boolean> {
  try {
    // For now, we don't have a separate teams table, so we just return true
    // In the future, you could create a teams table and insert here
    console.log('Adding team member:', teamName);
    return true;
  } catch (error) {
    console.error('Error adding team member:', error);
    return false;
  }
}
