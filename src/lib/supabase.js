import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL; //Vite reads VITE_ prefixed variables at build time and embeds them in the final bundle.
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const insertUser = async(email, forename, surname, display_name) =>{

    const { data, error } = await supabase
      .from('users')
      .upsert([{ email, forename, surname, display_name}], { onConflict: ['email'] })
      .select('*');
  
    if (error) 
        console.error('Error:', error);
    else{
        console.log('User inserted or already exists:', data);
        return data[0];
    }
  }