export interface User {
  id?: number;            
  name: string;
  phone_number : string;
  email?: string;
  role?: string;
  password:string;          
  created_at?: Date;
}

export interface HazardCategory {
  id?: number;
  name: string;
  priority?: string; 
}

