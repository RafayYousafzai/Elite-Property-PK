export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  email?: string | null;
  phone?: string | null;
  linkedin?: string | null;
  twitter?: string | null;
  facebook?: string | null;
  instagram?: string | null;
  specialties: string[];
  experience: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface TeamMemberFormData {
  name: string;
  role: string;
  image: string;
  bio: string;
  email: string;
  phone: string;
  linkedin: string;
  twitter: string;
  facebook: string;
  instagram: string;
  specialties: string[];
  experience: string;
  display_order: number;
  is_active: boolean;
}
