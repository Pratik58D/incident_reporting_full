export interface User {
  id?: number;            
  name: string;
  email: string;
  phone_number : string;
  role?: string;          
  created_at?: Date;
}

export interface HazardCategory {
  id?: number;
  name: string;
  priority?: string; 
}


