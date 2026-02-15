import { json } from '@sveltejs/kit';
import { supabase } from '$lib/server/supabase';

export async function POST({ request }) {
    const userData = await request.json();
    const { data, error } = await supabase
      .from('users')
      .upsert([userData], { onConflict: ['email'] })
      .select('*');

    if (error) return json({ error: error.message }, { status: 500 });
    return json(data[0]);
}
