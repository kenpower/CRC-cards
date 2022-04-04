<script>
  import { createEventDispatcher } from 'svelte';
  import Icon from "@iconify/svelte";
  //import dragIcon from "@iconify/icons-mdi/drag";
  import dragDropLine from '@iconify/icons-ri/drag-drop-line';
  import dragIcon from '@iconify/icons-mdi/drag';
  export let data = {};

  let dragIconVisible = false;

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

  $: iconVisibleStyle = dragIconVisible ? "visibility: visible" : "visibility: hidden";

  $: iconStyle = "font-size: 1.5rem; cursor: move;" + iconVisibleStyle;

</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<div draggable={true} 
  on:mouseover = "{mouseover}" 
  on:mouseout = "{mouseout}" 
  on:dragstart|stopPropagation={(e) => dragStart(e)}
  on:dragend={dragEnd}>
  <Icon icon={dragIcon} style={iconStyle} inline={true} />
  <div
    draggable={true}
    on:dragstart={catchAndPreventDragStartEventGettingToParent}>
  <slot />
  </div>
</div>

<style>
  div {
    display: flex;
    align-items: center;
  }
</style>