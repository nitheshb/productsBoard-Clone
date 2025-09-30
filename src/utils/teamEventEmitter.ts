// Simple event emitter for team member updates
type TeamUpdateListener = (teamName: string) => void;

class TeamEventEmitter {
  private listeners: TeamUpdateListener[] = [];

  subscribe(listener: TeamUpdateListener): () => void {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  emit(teamName: string): void {
    this.listeners.forEach(listener => listener(teamName));
  }
}

export const teamEventEmitter = new TeamEventEmitter();
