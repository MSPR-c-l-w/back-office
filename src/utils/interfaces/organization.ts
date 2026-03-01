/** Configuration de marque (couleurs, logo, etc.) d'une organisation */
export interface BrandingConfig {
    primaryColor?: string;
    logoUrl?: string;
    [key: string]: string | undefined;
}

export interface Organization {
    id: number;
    name: string;
    type: string;
    branding_config: BrandingConfig;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
    is_active: boolean;
    is_deleted: boolean;
}