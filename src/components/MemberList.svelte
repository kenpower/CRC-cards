<script>
 export let addMember;
 export let editMember;
 export let members
 export let newMemberPlaceholder

 let focused = false;
 

</script>

<div class="memberList"
    on:mouseover = "{() => focused = true}" on:focus = "{() => focused = true}" 
    on:blur="{() => focused = false}" on:mouseleave="{() => focused = false}" 
    >
        {#each members as member}
            <input type="text" class="editable" contenteditable="true" 
                bind:value={member} 
                on:change="{editMember}"/>
        {/each}
        <input type="text" class="editable empty" class:focused contenteditable="true"
            placeholder={newMemberPlaceholder}
            on:change= { e => {
                addMember(e.target.value);
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