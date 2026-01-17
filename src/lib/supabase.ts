
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://zhxickunddldjdusalfq.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_xFf78d86OQqGf8EkGpOqAQ_HIEmW92f';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
