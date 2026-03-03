import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.EXPO_PUBLIC_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing supabase URL or Key in .env");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    console.log("Testing connection to:", supabaseUrl);

    try {
        const { data, error } = await supabase
            .from('candidates')
            .insert([
                {
                    first_name: 'Test',
                    last_name: 'User',
                    full_name: 'Test User',
                    email: 'test' + Date.now() + '@example.com'
                }
            ])
            .select();

        if (error) {
            console.error("SUPABASE ERROR:", error);
        } else {
            console.log("SUCCESS! Row inserted:", data);

            // Clean up test data
            if (data && data.length > 0) {
                await supabase.from('candidates').delete().eq('id', data[0].id);
                console.log("Test row cleaned up.");
            }
        }
    } catch (err) {
        console.error("CATCH ERROR:", err);
    }
}

testConnection();
