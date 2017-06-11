export interface JwtPayload {
    userId: string; // UUID string
    email: string;
    customerId: string; //  // UUID string, if user is customer
}
