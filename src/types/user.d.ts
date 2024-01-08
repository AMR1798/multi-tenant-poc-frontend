export interface User {
    "id": number,
    "email": string,
    "name"?: string,
    "role": "USER" | "SUPERADMIN" | "ADMIN",
    "isEmailVerified": boolean,
    "createdAt": string,
    "updatedAt": string,
    "deletedAt"?: string
}