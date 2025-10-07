

// app/types/index.ts

export interface VersionProgress {
  version: string;
  progress: number;
}

export interface Product {
  id: string;
  name: string;
  status?: string;
  progress?: number;
  version?: string;
  version_progress?: VersionProgress[];
  team?: string;
  days?: number;
  startdate?: string;
  targetdate?: string;
  completedon?: string;
  remarks?: string;
  description?: string;
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
  description?: string;
  version?: string;
  version_progress?: VersionProgress[];
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
  description?: string;
  version?: string;
  version_progress?: VersionProgress[];
  created_at: string;
  updated_at?: string;
  task_type?: string; // New field for task type (dev, testing, ux, etc.)
}

// New interface for multi-task creation
export interface MultiTaskItem {
  task_type: string;
  name: string;
  status: string;
  progress: number;
  team: string;
  days: number | null;
  startdate: string | null;
  targetdate: string | null;
  completedon: string | null;
  remarks: string;
  description: string;
  version: string;
}

export interface TaskType {
  id: string;
  name: string;
  color: string;
  description?: string;
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

