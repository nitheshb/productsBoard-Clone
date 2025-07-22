

// app/types/index.ts

export interface Product {
  id: string;
  name: string;
  status?: string;
  progress?: number;
  version?: string;
  team?: string;
  days?: number;
  startdate?: string;
  targetdate?: string;
  completedon?: string;
  remarks?: string;
  owner?: string;
  created_at: string;
  components?: Component[];
}

export interface Component {
  id: string;
  product_id: string;
  name: string;
  status?: string;
  progress?: number;
  team?: string;
  days?: number;
  startdate?: string;
  targetdate?: string;
  completedon?: string;
  remarks?: string;
  version?: string;
  created_at: string;
  features?: Feature[];
}


export interface Feature {
  id: string;
  component_id: string;
  name: string;
  status?: string;
  progress?: number;
  team?: string;
  days?: number;
  startdate?: string;
  targetdate?: string;
  completedon?: string;
  remarks?: string;
  version?: string;
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

export interface Version {
  id: string;
  version: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

