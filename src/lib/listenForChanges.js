 

// Function to listen to changes for a given project_id
export const listenForChanges = (projectId, supabase, callback) => {
  ['projects', 'cards', 'responsibilities', 'collaborators'].forEach((table) => {
    supabase
      .channel(`realtime:${table}`)  // Unique channel per table
      .on(
        'postgres_changes', 
        {   event: '*', 
            schema: 'public', 
            table, 
            filter: table=="projects"?
                `id=eq.${projectId}`:
                `project_id=eq.${projectId}`,
        },

        (payload) => {
          console.log(`Change detected in ${table}:`, payload);
          console.log(`callback:`, callback);
          callback();
        }
      )
      .subscribe();
  });
};
