 <script>
    export let text ="";
    export let edit;
    export let id;

    
    let draggedMember = null;
    let focused = false;
 
    //TODO: make members draggable
    // use drag drop API
    // see here (modify to make dragable work) https://svelte.dev/repl/b225504c9fea44b189ed5bfb566df6e6?version=3.46.4

    const dragStart = (event, text, id) => {
        //remove();

        const data = {text, id};
        event.dataTransfer.effectAllowed = "move";
   	    event.dataTransfer.setData('text/plain', JSON.stringify(data));
        //text="";
        setTimeout(()=> edit("", id), 500);
    }

    // const drag = (event, member, idx) => {
    //     draggedMember = idx;
    //     text=text;
    // }
    

</script>
    <div draggable={true}
         on:dragstart|stopPropagation={event => dragStart(event, text, id)}>

    <input type="text" class="editable" contenteditable="true" 
                        
                        bind:value={text} 
                        on:change={e => edit(e.target.value, id)}
                        />
</div>
<style>
    input.editable{
    display: block;
    cursor: text;
    background-color: transparent;
    border: none;
    padding: 0 ;
    margin : 0;
}

.empty{
    color: #777;
     visibility: hidden;

}
.empty.focused{
    visibility: visible;
}

input.editable:hover{
    background-color: azure;
}
</style>