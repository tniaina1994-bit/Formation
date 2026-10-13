import { User } from './user.model';
import { Project } from './project.model';

export interface Task {
  id: number;
  slug: string;
  title: string;
  description?: string;
  status: string;
  due_date?: string;
  project_id: number;
  assigned_to?: number;
  created_at: string;
  updated_at: string;
}

export interface TaskRequest {
  title: string;
  description?: string;
  status?: string;
  due_date?: string;
  assigned_to?: string;
}
