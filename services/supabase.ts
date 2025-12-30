
import { createClient } from '@supabase/supabase-js';

// Прямое использование предоставленных данных
const supabaseUrl = 'https://qyuusjcwlfszjrqaqlaj.supabase.co';
const supabaseAnonKey = 'sb_publishable_6nnK5riRlVvVV_ET1sU8oQ_q-sf-wA9';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
