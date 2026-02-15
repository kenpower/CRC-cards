import { json } from '@sveltejs/kit';
import { supabase } from '$lib/server/supabase';

export async function GET({ url }) {
    const id = url.searchParams.get('id');
    const owner_id = url.searchParams.get('owner_id');

    let query = supabase.from("projects").select("*, cards(count), users(display_name) ");

    if (id) {
        query = query.eq('id', id).single();
    } else if (owner_id) {
        query = query.eq('owner_id', owner_id);
    }

    const { data, error } = await query;

    if (error) {
        return json({ error: error.message }, { status: 500 });
    }

    if (id) {
        const ownerDisplayName = data?.users?.display_name ?? "Unknown";
        return json({ ...data, ownerDisplayName });
    } else {
        const formattedData = data.map((record) => {
            record.cardCount = record.cards?.[0]?.count || 0;
            return record;
        });
        return json(formattedData);
    }
}

export async function POST({ request }) {
    const projectData = await request.json();
    const { data, error } = await supabase
        .from("projects")
        .insert(projectData)
        .select("*")
        .single();

    if (error) {
        return json({ error: error.message }, { status: 500 });
    }

    return json(data);
}

export async function DELETE({ url }) {
    const id = url.searchParams.get('id');
    if (!id) {
        return json({ error: 'Missing id' }, { status: 400 });
    }

    const { error } = await supabase.from("projects").delete().eq("id", id);

    if (error) {
        return json({ error: error.message }, { status: 500 });
    }

    return json({ success: true });
}
