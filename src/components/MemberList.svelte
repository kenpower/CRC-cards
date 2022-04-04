<script>
  import Draggable from "./Draggable.svelte";
  import EditableText from "./EditableText.svelte";
  import { flip } from "svelte/animate";
  export let newMemberPlaceholder;
  export let members;

  let draggedMember = null;
  let focused = false;

  const onDrop = (event) => {
    const data = JSON.parse(event.dataTransfer.getData("text/plain"));
    //event.target.textContent = data;
    console.log(data.text);
    add(data.text);
  };

  const edit = (newText, idx) => {
    const removeEmpty = (list) => list.filter((s) => s && s.trim() !== "");
    members[idx] = newText;
    console.log("update!");
    members = removeEmpty(members);

  };

  const add = (newMember) => {
    console.log(members)
    members = [...members, newMember];
  };

  const remove = (toRemove) => {
    console.log("remove", toRemove);
    members = members.filter((s) => s  !== toRemove);
  };

  const partial_edit = (idx) => (newText) => edit(newText, idx);
</script>

<div
  class="memberList"
  on:mouseover={() => (focused = true)}
  on:focus={() => (focused = true)}
  on:blur={() => (focused = false)}
  on:mouseleave={() => (focused = false)}
  on:dragover|preventDefault={(_) => false}
  on:drop|preventDefault={onDrop}
>
  {#each members as member, id (id)}
  <div animate:flip="{{delay: 250, duration: 250}}" >
    <Draggable data={{ text: member, id }} on:dragBegin = {()=>remove(member)}>
      <!-- TODO blur editable when dragging starts <div draggable=true on:dragstart={e=>console.log(e, e.target.blur())}> -->
      <EditableText text={member} edit={partial_edit(id)} />
      <!-- </div> -->
    </Draggable>
  </div>
  {/each}
  <input
    type="text"
    class="editable empty"
    class:focused
    contenteditable="true"
    placeholder={newMemberPlaceholder}
    on:change={(e) => {
      add(e.target.value);
      e.target.value = "";
    }}
  />
</div>

<style>
  .memberList {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    padding: 0.25rem;
  }

  input.editable {
    display: block;
    cursor: text;
    background-color: transparent;
    border: none;
    padding: 0;
    margin: 0;
  }

  .empty {
    color: #777;
    visibility: hidden;
  }
  .empty.focused {
    visibility: visible;
  }

  input.editable:hover {
    background-color: azure;
  }
</style>
