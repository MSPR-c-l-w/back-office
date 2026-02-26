export interface Organization {
    id: number;
    name: string;
    type: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    branding_config: Record<string, any>;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
    is_active: boolean;
    is_deleted: boolean;
}