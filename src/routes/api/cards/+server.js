import { json } from '@sveltejs/kit';
import { supabase } from '$lib/server/supabase';

export async function GET({ url }) {
    const project_id = url.searchParams.get('project_id');
    if (!project_id) {
        return json({ error: 'Missing project_id' }, { status: 400 });
    }

    const { data, error } = await supabase
        .from("cards")
        .select(`
            *,
            collaborators (id, name, display_order),
            responsibilities (id, name, display_order)
        `)
        .eq("project_id", project_id);

    if (error) {
        return json({ error: error.message }, { status: 500 });
    }

    return json(data);
}

export async function POST({ request }) {
    const cardData = await request.json();
    const { data, error } = await supabase
        .from("cards")
        .insert(cardData)
        .select("*")
        .single();

    if (error) {
        return json({ error: error.message }, { status: 500 });
    }

    return json(data);
}

export async function PATCH({ request }) {
    const { id, ...updateData } = await request.json();
    if (!id) {
        return json({ error: 'Missing id' }, { status: 400 });
    }

    const { data, error } = await supabase
        .from("cards")
        .update(updateData)
        .eq("id", id)
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

    const { error } = await supabase.from("cards").delete().eq("id", id);

    if (error) {
        return json({ error: error.message }, { status: 500 });
    }

    return json({ success: true });
}
