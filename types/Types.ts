export type Todo = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
};

export type ReactQueryProviderProps = {
  children: React.ReactNode;
};

export type Job = {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  salary: number;
  posted_by: string;
};

export type SidebarProps = {
  isOpen: boolean;
  isModelOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  setIsModelOpen: (isOpen: boolean) => void;
};

export type Application = {
  id: string;
  job_id: string;
  user_id: string;
  resume: string;
  status: string;
};
