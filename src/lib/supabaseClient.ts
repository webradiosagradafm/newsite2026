import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://shfueyteaenkkugcevfl.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoZnVleXRlYWVua2t1Z2NldmZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUyOTU2NzgsImV4cCI6MjEwMDg3MTY3OH0.BU_LK3S-s6Mzlrbe1_Yh67xvlthv7c8S8rBG5eWu7pM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)