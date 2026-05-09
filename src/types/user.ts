import { LazyloadResponseState } from "./general";

export type UserData = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_superuser: boolean;
  created_date?: string;
  modified_date?: string;
};

export interface UserDetailsState {
  data?: UserData;
  loading: boolean;
}

export interface UserTableState extends LazyloadResponseState {
  data?: UserData[];
}

export type CreateUserParams = Omit<
  CreateUserFormValues,
  "new_password" | "confirm_password"
> & {
  password: string;
};

export interface CreateUserFormValues {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  new_password: string;
  confirm_password: string;
  is_active: boolean;
  is_superuser: boolean;
}

export interface UpdateUserFormValues {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_superuser: boolean;
}
