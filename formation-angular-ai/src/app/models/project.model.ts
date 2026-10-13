import { User } from './user.model';

export interface Project {
  id: number;
  slug: string;
  name: string;
  description?: string;
  owner_id?: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectRequest {
  name: string;
  description?: string;
}
