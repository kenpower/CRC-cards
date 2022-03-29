<script>
    export let text="";
    export let edit;
</script>

<input  
    type="text" 
    class="editable" 
    contenteditable="true" 
    bind:value={text} 
    on:change={e => edit(e.target.value)}
/>

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