import { createClient } from '@supabase/supabase-js';
import type { Database } from './types/database';

// Environment variables with fallbacks and validation
const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || 'https://oydklzlkgllkebepljtq.supabase.co';
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95ZGtsemxrZ2xsa2ViZXBsanRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5Mjk2NjYsImV4cCI6MjA3MDUwNTY2Nn0.zGJ9Er5-vugv12M0Ek-7adtWZr75HKJtvXjYV0tpLuw';

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase environment variables missing. Using default configuration.');
}

// Validate URL format
if (!supabaseUrl.includes('supabase.co')) {
  console.error('❌ Invalid Supabase URL format');
}

// Create Supabase client with error handling
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: typeof window !== 'undefined' ? window.localStorage : undefined
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  },
  global: {
    headers: {
      'X-Client-Info': 'campus-link@1.0.0'
    }
  }
});

// Test connection function with better error handling
export const testSupabaseConnection = async () => {
  try {
    console.log('🔍 Testing Supabase connection...');
    console.log('📍 URL:', supabaseUrl);
    
    // Test basic connection
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    
    if (error) {
      // PGRST116 means table doesn't exist yet, which is expected
      if (error.code === 'PGRST116') {
        console.log('✅ Supabase connected! (Tables not created yet - this is normal)');
        return { success: true, message: 'Connected - Database setup needed' };
      }
      
      console.error('❌ Supabase connection error:', error);
      return { success: false, error: error.message };
    }
    
    console.log('✅ Supabase connection successful!');
    return { success: true, data };
  } catch (error) {
    console.error('❌ Supabase connection failed:', error);
    return { success: false, error: (error as Error).message };
  }
};

// Helper function to check if user is authenticated
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Error getting current user:', error);
      return null;
    }
    return user;
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    return null;
  }
};

// Helper function to get user profile
export const getUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    return null;
  }
};

// Connection status checker
export const checkSupabaseStatus = () => {
  return {
    configured: !!(supabaseUrl && supabaseAnonKey),
    url: supabaseUrl,
    hasValidUrl: supabaseUrl?.includes('supabase.co'),
    hasValidKey: supabaseAnonKey?.startsWith('eyJ')
  };
};

// Export for use in other parts of the application
export default supabase;

// Log connection status on module load
console.log('🔌 Supabase Client Initialized');
console.log('📍 Project URL:', supabaseUrl);
console.log('🔑 API Key Status:', supabaseAnonKey ? '✅ Present' : '❌ Missing');