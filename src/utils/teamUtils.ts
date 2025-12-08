import { supabase } from '@/lib/supabaseClient';
import { teamEventEmitter } from './teamEventEmitter';

// Re-export teamEventEmitter for external use
export { teamEventEmitter };

export interface TeamMember {
  id?: string;
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
    // Also include employee names from `pb_employees` so the dropdown can show employees
    const [productsResult, componentsResult, featuresResult, employeesResult] = await Promise.all([
      supabase.from('pb_products').select('team').not('team', 'is', null),
      supabase.from('pb_components').select('team').not('team', 'is', null),
      supabase.from('pb_features').select('team').not('team', 'is', null),
      supabase.from('pb_employees').select('id, name').not('name', 'is', null)
    ]);

    // Combine all team members
    const allTeams: string[] = [];
    
    if (productsResult.data) {
      allTeams.push(...productsResult.data.map((p: any) => p.team).filter(Boolean));
    }
    if (componentsResult.data) {
      allTeams.push(...componentsResult.data.map((c: any) => c.team).filter(Boolean));
    }
    if (featuresResult.data) {
      allTeams.push(...featuresResult.data.map((f: any) => f.team).filter(Boolean));
    }

    // Count occurrences and create unique list
    const teamCounts: Record<string, number> = {};
    allTeams.forEach(team => {
      teamCounts[team] = (teamCounts[team] || 0) + 1;
    });

    // Map employees by name for id lookup
    const employeesByName: Record<string, { id?: string; name: string }> = {};
    if (employeesResult && employeesResult.data) {
      employeesResult.data.forEach((e: any) => {
        if (e && e.name) employeesByName[e.name] = { id: e.id, name: e.name };
      });
    }

    // Convert to array and sort by count (most used first). If an employee exists, include its id.
    const teamMembers: TeamMember[] = Object.entries(teamCounts)
      .map(([name, count]) => ({
        id: employeesByName[name]?.id,
        name,
        count
      }))
      .sort((a, b) => b.count - a.count);

    // Also include any employees that weren't present in the counts (zero occurrences)
    if (employeesResult && employeesResult.data) {
      employeesResult.data.forEach((e: any) => {
        if (e && e.name && !(e.name in teamCounts)) {
          teamMembers.push({ id: e.id, name: e.name, count: 0 });
        }
      });
    }

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
export async function addTeamMember(teamName: string): Promise<TeamMember | null> {
  try {
    if (!teamName || !teamName.trim()) return null;
    const name = teamName.trim();

    // Check if employee already exists (avoid duplicates)
    const { data: existing, error: checkError } = await supabase
      .from('pb_employees')
      .select('id')
      .eq('name', name)
      .maybeSingle();

    if (checkError) {
      console.error('Error checking existing employee:', checkError);
      return null;
    }

    if (existing) {
      // Ensure cache contains it and emit event
      addTeamMemberToCache(name);
      return { id: (existing as any).id, name } as TeamMember;
    }

    // Create initials from name
    const initials = name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);

    // Insert into pb_employees
    // Some schemas have a NOT NULL `team` column; include it to satisfy constraints.
    const { data, error } = await supabase
      .from('pb_employees')
      .insert([{ name, initials, team: name }])
      .select()
      .single();

    if (error) {
      console.error('Error inserting new employee:', error);
      return null;
    }

    // Update cache and notify listeners
    addTeamMemberToCache(name);
    return { id: (data as any).id, name: (data as any).name, count: 1 } as TeamMember;
  } catch (error) {
    console.error('Error adding team member:', error);
    return null;
  }
}
