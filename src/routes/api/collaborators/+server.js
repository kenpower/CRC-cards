import { json } from '@sveltejs/kit';
import { supabase } from '$lib/server/supabase';

export async function POST({ request }) {
    const row = await request.json();
    const { data, error } = await supabase.from("collaborators").insert(row).select("*").single();
    if (error) return json({ error: error.message }, { status: 500 });
    return json(data);
}

export async function PATCH({ request }) {
    const { id, ...updateData } = await request.json();
    if (!id) return json({ error: 'Missing id' }, { status: 400 });
    const { data, error } = await supabase.from("collaborators").update(updateData).eq("id", id).select("*").single();
    if (error) return json({ error: error.message }, { status: 500 });
    return json(data);
}

export async function DELETE({ url }) {
    const id = url.searchParams.get('id');
    if (!id) return json({ error: 'Missing id' }, { status: 400 });
    const { error } = await supabase.from("collaborators").delete().eq("id", id);
    if (error) return json({ error: error.message }, { status: 500 });
    return json({ success: true });
}
