// src/types/stats.ts

export type AvailabilityAttributes = {
    id: number;
    userId: number;
    date: Date;
    createdAt: Date;
    updatedAt: Date;
};

export type AvailabilityCreationAttributes = Omit<
    AvailabilityAttributes,
    'id' | 'createdAt' | 'updatedAt'
>;

export type ReputationAttributes = {
    id: number;
    userId: number;
    score: number;
    createdAt: Date;
    updatedAt: Date;
};

export type ReputationCreationAttributes = Omit<
    ReputationAttributes,
    'id' | 'createdAt' | 'updatedAt'
>;

export type ExchangeAttributes = {
    id: number;
    userId: number;
    withUserId?: number;
    duration: number;
    createdAt: Date;
    updatedAt: Date;
};

export type ExchangeCreationAttributes = Omit<ExchangeAttributes, 'id' | 'createdAt' | 'updatedAt'>;
