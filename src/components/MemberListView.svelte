<script>
  import Draggable from "./Draggable.svelte";
  import EditableText from "./EditableText.svelte";
  import { dndzone, SOURCES, TRIGGERS } from "svelte-dnd-action";
  import { flip } from "svelte/animate";
  import Icon from "@iconify/svelte";
  import dragIcon from "@iconify/icons-mdi/drag";
  import { fade } from "svelte/transition";

  let { newMemberPlaceholder, items = $bindable(), addItem } = $props();

  const flipDurationMs = 200;
  let dragDisabled = $state(true);
  let dragIconVisible = true;
  let focused = $state(false);

  function handleConsider(e) {
    const {
      items: newItems,
      info: { source, trigger },
    } = e.detail;
    items = newItems;
    // Ensure dragging is stopped on drag finish via keyboard
    if (source === SOURCES.KEYBOARD && trigger === TRIGGERS.DRAG_STOPPED) {
      dragDisabled = true;
    }
  }
  function handleFinalize(e) {
    const {
      items: newItems,
      info: { source },
    } = e.detail;
    items = newItems;
    // Ensure dragging is stopped on drag finish via pointer (mouse, touch)
    if (source === SOURCES.POINTER) {
      dragDisabled = true;
    }
  }

  function startDrag(e) {
    // preventing default to prevent lag on touch devices (because of the browser checking for screen scrolling)
    e.preventDefault();
    dragDisabled = false;
  }

  function handleKeyDown(e) {
    if ((e.key === "Enter" || e.key === " ") && dragDisabled)
      dragDisabled = false;
  }

  const add = (newMember) => {
    //let id =  self.crypto.randomUUID();
    console.log(items);

    addItem(newMember);
  };

  let iconVisibleStyle = $derived(
    focused ? "visibility: visible" : "visibility: hidden"
  );

  let iconStyle = $derived(
    "font-size: 1.5rem; cursor: move;" + iconVisibleStyle
  );

  console.log("items", $inspect(items));
</script>

<div
  class="memberList"
  onmouseover={() => (focused = true)}
  onfocus={() => (focused = true)}
  onblur={() => (focused = false)}
  onmouseleave={() => (focused = false)}
>
  <section
    class="draggableItems"
    use:dndzone={{ items, dragDisabled, flipDurationMs, dropTargetStyle: "" }}
    onconsider={handleConsider}
    onfinalize={handleFinalize}
  >
    {#each items as item (item.id)}
      <div class="member-wrapper" animate:flip={{ duration: flipDurationMs }}>
        <div
          tabindex={dragDisabled ? 0 : -1}
          aria-label="drag-handle"
          class="handle"
          style={dragDisabled ? "cursor: grab" : "cursor: grabbing"}
          onmousedown={startDrag}
          ontouchstart={startDrag}
          onkeydown={handleKeyDown}
        >
          <Icon icon={dragIcon} style={iconStyle} inline={true} />
        </div>
        <EditableText class="member-name" text={item.name}></EditableText>
      </div>
    {/each}
  </section>
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
  .member-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  .draggableItems {
    min-height: 2rem;
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
    padding-left: 1rem;
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
