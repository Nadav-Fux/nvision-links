import type { Database } from './types.js';

/** Full row type for a given Supabase table. Use for read operations. */
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];

/** Insert payload type for a given Supabase table. */
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];

/** Update payload type for a given Supabase table (all fields optional). */
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

/** Resolved enum type from the Supabase schema. */
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];

/** Resolved RPC function type from the Supabase schema. */
export type Functions<T extends keyof Database['public']['Functions']> = Database['public']['Functions'][T];
