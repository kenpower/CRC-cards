import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/private';

// Fallback to VITE_ prefixed variables if others are not set
const supabaseUrl = env.SUPABASE_URL || env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = env.SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY || 'placeholder';

if (supabaseUrl === 'https://placeholder.supabase.co' || supabaseAnonKey === 'placeholder') {
  console.warn('Supabase URL or Anon Key is missing in environment variables. Using placeholders for build.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
