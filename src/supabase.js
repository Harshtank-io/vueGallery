import { createClient } from "@supabase/supabase-js"

const supabase_url = "https://dxkgmrzsnljhbzmfsedi.supabase.co"
const supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4a2dtcnpzbmxqaGJ6bWZzZWRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgyMzYyOTIsImV4cCI6MjA1MzgxMjI5Mn0.enRZy5Ot1Ey--X1ED5VZ2Ka9Xm1o6ER61Iy1yKCxkHQ"
export const supabase = createClient(supabase_url,supabase_key) 