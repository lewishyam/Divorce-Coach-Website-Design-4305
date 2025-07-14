import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://lhurfgiqqputcnzzyssx.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxodXJmZ2lxcXB1dGNuenp5c3N4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MjU1OTQsImV4cCI6MjA2ODAwMTU5NH0.n5JbchTGyezoyJDku_aYz7Ncg7prerQKJJsM2ULBdjA'

if (SUPABASE_URL === 'https://<PROJECT-ID>.supabase.co' || SUPABASE_ANON_KEY === '<ANON_KEY>') {
  throw new Error('Missing Supabase variables')
}

export default createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})