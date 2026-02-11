import { createClient } from '@supabase/supabase-js'

// Public anon key - safe to expose in frontend
const supabaseUrl = 'https://cmwbrhatnkjqwqljvifn.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtd2JyaGF0bmtqcXdxbGp2aWZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2NzAzMjAsImV4cCI6MjA4NjI0NjMyMH0.Nam5aYF9-yn-9i6KIXJ-wUjiLrcXlaLhflvtAOwuAng'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
