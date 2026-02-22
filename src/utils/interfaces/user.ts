export interface User {
    id: number
    organization_id?: number
    email: string
    first_name: string
    last_name: string
    date_of_birth: Date
    gender: string
    height: number
    created_at: Date
    updated_at: Date
    deletedAt?: Date
    is_active: boolean
    is_deleted: boolean
}