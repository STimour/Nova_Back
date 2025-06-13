class ErrorMessages {
    // Auth & Token
    public static missingAuth(): string {
        return 'Authorization header is missing or invalid. %s';
    }
    public static invalidToken(): string {
        return 'Invalid, expired, or unauthorized token: %s';
    }
    public static forbidden(): string {
        return 'Forbidden. User associated with the token not found or inactive. %s';
    }
    public static internal(): string {
        return 'Internal server error during token verification. %s';
    }
    public static invalidCredentials(): string {
        return 'Invalid credentials. %s';
    }
    public static emailPasswordRequired(): string {
        return 'Email and password are required. %s';
    }
    public static logoutSuccess(): string {
        return 'Logout successful. %s';
    }
    public static tokenNotFound(): string {
        return 'Token not found or inactive: %s';
    }
    public static tokenDeactivationFailed(): string {
        return 'Failed to deactivate token: %s';
    }

    // User
    public static userNotFound(): string {
        return 'User not found with ID: %s';
    }
    public static usersNotFound(): string {
        return 'No users found. %s';
    }
    public static invalidUserId(): string {
        return 'Invalid user ID: %s';
    }
    public static userAlreadyExists(): string {
        return 'User already exists: %s %s';
    }
    public static errorCreatingUser(): string {
        return 'Error creating user: %s %s';
    }
    public static errorFetchingUser(): string {
        return 'Error fetching user with ID: %s';
    }
    public static errorFetchingUsers(): string {
        return 'Error fetching users. %s';
    }
    public static errorDeletingUser(): string {
        return 'Error deleting user with ID: %s';
    }
    public static errorUpdatingUser(): string {
        return 'Error updating user with ID: %s';
    }

    // Helper
    public static helperNotFound(): string {
        return 'Helper not found with ID: %s';
    }
    public static errorFetchingHelpers(): string {
        return 'Error fetching helpers. %s';
    }

    // Student
    public static studentNotFound(): string {
        return 'Student not found with ID: %s';
    }
    public static errorFetchingStudents(): string {
        return 'Error fetching students. %s';
    }

    // Generic
    public static badRequest(): string {
        return 'Bad request. %s';
    }
    public static internalServerError(): string {
        return 'Internal Server Error. %s';
    }
    public static notFound(): string {
        return 'Resource not found. %s';
    }
    public static unauthorized(): string {
        return 'Unauthorized. %s';
    }
    public static forbiddenGeneric(): string {
        return 'Forbidden. %s';
    }
    public static operationFailed(): string {
        return 'Operation failed. %s';
    }
}

export default ErrorMessages;