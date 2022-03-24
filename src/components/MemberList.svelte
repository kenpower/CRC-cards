<script>
    import DraggableInput from "./DraggableInput.svelte";
    //export let addMember;
    //export let editMember;
    export let halfCard;
    export let newMemberPlaceholder
    export let save


    let draggedMember = null;
    let focused = false;
    
    const onDrop = (event) =>  {
        const data = JSON.parse(event.dataTransfer.getData("text/plain"));
        //event.target.textContent = data;
        console.log(data.text);
        add(data.text);
    }

    const edit = (newText, idx) =>  {
        const removeEmpty = list => list.filter(s => s && s.trim() !== "");

        halfCard.members[idx] = newText;
        console.log("update");
        halfCard.members = removeEmpty(halfCard.members)
        save();
    }

    const add = (newMember) => {
        halfCard.members = [...halfCard.members, newMember]
        save();
    }

</script>

<div class="memberList"
    on:mouseover = "{() => focused = true}" on:focus = "{() => focused = true}" 
    on:blur="{() => focused = false}" on:mouseleave="{() => focused = false}"
    on:dragover|preventDefault = "{_ => false}"
    on:drop|preventDefault = "{onDrop}"
    >
        {#each halfCard.members as member, id}
            <DraggableInput {id} text={member} {edit}  />
        {/each}
        <input type="text" class="editable empty" class:focused contenteditable="true"
            placeholder={newMemberPlaceholder}
            on:change= { e => {
                add(e.target.value);
                e.target.value = '';
                }
            }
            />
</div>

<style>

.memberList {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }

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