<script>
    import Draggable from "./Draggable.svelte";
    import EditableText from "./EditableText.svelte";
    import { flip } from "svelte/animate";
    import { dndzone } from 'svelte-dnd-action';

    export let newMemberPlaceholder;
    export let members;

    const flipDurationMs = 200;
    let dragDisabled = true;
  
    let draggedMember = null;
    let focused = false;
  
    // const onDrop = (event) => {
    //   const data = JSON.parse(event.dataTransfer.getData("text/plain"));
    //   //event.target.textContent = data;
    //   console.log(data.text);
    //   add(data.text);
    // };
    
    function handleDndConsiderCards(e) {
        const {items: newItems, info: {source, trigger}} = e.detail;
        //const colIdx = columnItems.findIndex(c => c.id === cid);
        members = newItems;
        //columnItems = [...columnItems];
        if (source === SOURCES.KEYBOARD && trigger === TRIGGERS.DRAG_STOPPED) {
			dragDisabled = true;
		}
    }
    function handleDndFinalizeCards(e) {
        const {items: newItems, info: {source}} = e.detail;
        members= newItems;
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
		if ((e.key === "Enter" || e.key === " ") && dragDisabled) dragDisabled = false;
	}

    // $: dragDone = false;
  
    // const onDragOverMember = (existingMember, idx) => (event) => {
    //   console.log(event)
    //   const data = JSON.parse(event.dataTransfer.getData("text/plain"));
    //   const newMember = data.member;
    //   if(dragDone) return;
    //   console.log("dragover", members, idx, event)
    //   if(members.every(m => m.id != newMember.id)){
    //     members = [...members.slice(0, idx), newMember, ...members.slice(idx)];
    //     console.log("added", members);
    //     dragDone = true;
  
    //   }
   
    //   //insertBefore(event.target, draggedMember);
    // };
  
    // function handleClick(e) {
    //     alert('dragabble elements are still clickable :)');
    // }

    // const edit = (newText, idx) => {
    //   const removeEmpty = (list) => list.filter((s) => s.name && s.name.trim() !== "");
    //   members[idx].name = newText;
    //   console.log("update!");
    //   members = removeEmpty(members);
  
    // };
  
    const add = (newMember) => {
      let id =  self.crypto.randomUUID();
      console.log(members)
  
      members = [...members, {name: newMember, id: id}];
    };
  
    // const remove = (toRemove) => {
    //   console.log("remove", toRemove);
    //   members = members.filter((s) => s.id  !== toRemove.id);
    // };
  
    // const partial_edit = (idx) => (newText) => edit(newText, idx);
  </script>
  
<div class="memberList"
    on:mouseover={() => (focused = true)}
    on:focus={() => (focused = true)}
    on:blur={() => (focused = false)}
    on:mouseleave={() => (focused = false)}
>
    <div class="draggableItems"
        use:dndzone={{items: members, dragDisabled, flipDurationMs}}
        on:consider={(e) => handleDndConsiderCards(e)} 
        on:finalize={(e) => handleDndFinalizeCards(e)}>
            {#each members as item (item.id)}
                <div class="member-wrapper" animate:flip="{{duration: flipDurationMs}}">
                    <div tabindex={dragDisabled? 0 : -1} 
                        aria-label="drag-handle"
                        class="handle" 
                        style={dragDisabled ? 'cursor: grab' : 'cursor: grabbing'}
                        on:mousedown={startDrag} 
                        on:touchstart={startDrag}
                        on:keydown={handleKeyDown}/>
                    <span>{item.name}</span>
                </div>
            {/each}
    </div>
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
  
    .draggableItems{
        min-height: 2rem;
    }

    .handle {
		position: absolute;
		right: 0;
		width: 1em;
		height: 0.5em;
		background-color: grey;
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
  