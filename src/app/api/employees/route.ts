import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(request: NextRequest) {
  try {
    // Fetch unique teams from the database
    const { data: teamData, error: teamError } = await supabase
      .from('features')
      .select('team')
      .not('team', 'is', null);

    if (teamError) {
      throw teamError;
    }

    // Get unique teams
    const uniqueTeams = [...new Set(teamData.map(item => item.team).filter(Boolean))];
    
    // Create mock team members based on available teams
    const teamMembers = [
      { id: '1', name: 'Alice Johnson', role: 'Frontend Dev', initials: 'AJ', team: uniqueTeams[0] || 'Frontend' },
      { id: '2', name: 'Bob Smith', role: 'Backend Dev', initials: 'BS', team: uniqueTeams[1] || 'Backend' },
      { id: '3', name: 'Carol Davis', role: 'Full Stack Dev', initials: 'CD', team: uniqueTeams[2] || 'Full Stack' },
      { id: '4', name: 'David Wilson', role: 'DevOps Engineer', initials: 'DW', team: uniqueTeams[3] || 'DevOps' },
    ];

    return NextResponse.json({ teamMembers });
  } catch (error) {
    console.error('Error fetching team members:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team members' },
      { status: 500 }
    );
  }
}
