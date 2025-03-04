<script>
  import { preventDefault } from "svelte/legacy";

  const partial_edit = (idx) => (newText) => edit(newText, idx);
</script>

<div
  class="memberList"
  onmouseover={() => (focused = true)}
  onfocus={() => (focused = true)}
  onblur={() => (focused = false)}
  onmouseleave={() => (focused = false)}
  ondragover={preventDefault((_) => false)}
  ondrop={preventDefault(onDrop)}
>
  {#each members as member, idx (member.id)}
    <div animate:flip={{ delay: 250, duration: 250 }}>
      <Draggable
        data={{ text: member.name, idx }}
        on:dragFinish={() => remove(member)}
      >
        <!-- TODO blur editable when dragging starts <div draggable=true on:dragstart={e=>console.log(e, e.target.blur())}> -->
        <EditableText text={member.name} edit={partial_edit(idx)} />
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
    onchange={(e) => {
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

  :global(input.editable) {
    display: block;
    cursor: text;
    background-color: transparent;
    border: none;
    margin: 0;
    padding: 0.1rem;
  }

  .empty {
    color: #777;
    visibility: hidden;
  }
  .empty.focused {
    visibility: visible;
  }

  :global(input.editable:hover) {
    background-color: azure;
  }
</style>
