
export interface Recipe {
    id: string;
    title: string;
    imageUrl: string;
    createdAt: string;
    updatedAt?: string;
}

export interface Food {
    name: string;
    confidence: number;
}