import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Test connection function
export async function testConnection() {
  try {
    const { data, error } = await supabase.from('quotes').select('count').limit(1)
    if (error) throw error
    return { success: true, message: 'Connected to Supabase successfully' }
  } catch (error) {
    console.error('Supabase connection error:', error)
    return { success: false, message: 'Failed to connect to Supabase' }
  }
}
