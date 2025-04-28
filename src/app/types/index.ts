

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