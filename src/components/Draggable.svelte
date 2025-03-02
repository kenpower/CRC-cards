<script>
  import { stopPropagation } from 'svelte/legacy';

  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';
  import Icon from "@iconify/svelte";
  //import dragIcon from "@iconify/icons-mdi/drag";
  import dragDropLine from '@iconify/icons-ri/drag-drop-line';
  import dragIcon from '@iconify/icons-mdi/drag';
  let { data = {}, children } = $props();

  let dragIconVisible = $state(false);

  const dispatch = createEventDispatcher();

  const dragStart = (event) => {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", JSON.stringify(data));

    dispatch('dragBegin', {});
    //todo use nice svlete transition to slow gap being filled
  };

  const dragEnd = (event) => {
    dispatch('dragFinish', {});
  };

  const catchAndPreventDragStartEventGettingToParent = (event) => {
    //prevent drag behaviour for slot item, need editable/selectable behaviour instead
    event.preventDefault();
    event.stopPropagation();
    return false;
  };

  const mouseover = () => dragIconVisible = true;
  const mouseout = () => dragIconVisible = false;

  let iconVisibleStyle = $derived(dragIconVisible ? "visibility: visible" : "visibility: hidden");

  let iconStyle = $derived("font-size: 1.5rem; cursor: move;" + iconVisibleStyle);

</script>

<!-- svelte-ignore a11y_mouse_events_have_key_events -->
<div draggable={true} 
  onmouseover={mouseover} 
  onmouseout={mouseout} 
  ondragstart={stopPropagation((e) => dragStart(e))}
  ondragend={dragEnd}>
  <div style="min-width:25px">
    {#if dragIconVisible}
      <div transition:fade ={{duration:500}} >
        <Icon icon={dragIcon} style={iconStyle} inline={true} />
      </div>
    {/if}
  </div>
  <div
    draggable={true}
    ondragstart={catchAndPreventDragStartEventGettingToParent}>
  {@render children?.()}
  </div>
</div>

<style>
  div {
    display: flex;
    align-items: center;
  }
</style>