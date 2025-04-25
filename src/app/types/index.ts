export type Phase = {
  id: number;
  name: string;
  tasks: Task[];
  status: number;
  workDays: number;
};

export type Task = {
  id: number;
  name: string;
  phaseId: number;
  status: number;
  progress: number;
  workDays: number;
  startDate: string;
  endDate: string;
  team?: string;
  days?: number;
  targetDate?: string;
  remarks?: string;
};


export type Project = {
  id: number;
  name: string;
  address: string;
  phases: Phase[];
};

// app/types/index.ts

export interface Product {
  id: string;
  name: string;
  status?: string; // Added status
  progress?: number; // Added progress
  team?: string; // Added team
  days?: number; // Added days
  startDate?: string; // Added startDate
  targetDate?: string; // Added targetDate
  completedOn?: string; // Added completedOn
  remarks?: string; // Added remarks
  created_at: string;
  components?: Component[];
  owner?: string;
  
}

export interface Component {
  id: string;
  product_id: string;
  name: string;
  status?: string; // Added status
  progress?: number; // Added progress
  team?: string; // Added team
  days?: number; // Added days
  startDate?: string; // Added startDate
  targetDate?: string; // Added targetDate
  completedOn?: string; // Added completedOn
  remarks?: string; // Added remarks
  created_at: string;
  features?: Feature[];
 
 
}

export interface Feature {
  id: string;
  component_id: string;
  name: string;
  status?: string; // Added status
  progress?: number; // Added progress
  team?: string; // Added team
  days?: number; // Added days
  startDate?: string; // Added startDate
  targetDate?: string; // Added targetDate
  completedOn?: string; // Added completedOn
  remarks?: string; // Added remarks
  color?: 'yellow' | 'teal' | 'blue' | string;
  created_at: string;
  owner?: string;
  
}


export interface TableItem {
  type: 'product' | 'component' | 'feature';
  id: string;
  name: string;
  level: number;
  data: Product | Component | Feature;
  children?: TableItem[];
}