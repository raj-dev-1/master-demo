export interface LoginFormValues {
  email: string;
  password: string;
}

export interface SettingFormValues {
  id?: number;
  name: string;
  email?: string;
  gender: string;
  image: string;
  gr_number?: null;
  phone: string;
  address: string;
  department?: string;
  div?: string;
  createdAt?: string;
  updatedAt?: string;
  user: string;
}
