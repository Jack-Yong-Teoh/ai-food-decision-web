export interface ProfilePasswordFormValues {
    current_password: string;
    new_password: string;
    confirm_password?: string;
}

export interface LogInParams { username: string, password: string }