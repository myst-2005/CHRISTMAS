
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jawimglodnhhidvvpgar.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imphd2ltZ2xvZG5oaGlkdnZwZ2FyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzODcyNjMsImV4cCI6MjA4MDk2MzI2M30.MmtiauPQ88ah87OVRPV8VcYmmFb0FImW9wbLp_6A21w'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
