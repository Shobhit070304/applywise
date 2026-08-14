export interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  jobType: 'Full-time' | 'Part-time' | 'Contract' | 'Remote' | 'Hybrid' | 'Internship';
  experienceLevel: 'Fresher' | '0-2 yrs' | '2-5 yrs' | '5+ yrs';
  salary: {
    min?: number;
    max?: number;
    currency: string;
    isDisclosed: boolean;
  };
  description: string;
  skills: string[];
  sourceUrl?: string;
  status: 'active' | 'closed';
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalJobs: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface JobsResponse {
  success: boolean;
  data: Job[];
  pagination: PaginationMeta;
}
