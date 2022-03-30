<script>
  import Icon from "@iconify/svelte";
  import dragIcon from "@iconify/icons-mdi/drag";
  import dragDropLine from '@iconify/icons-ri/drag-drop-line';
  export let data = {};

  let dragIconVisible = false;

  const dragStart = (event) => {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", JSON.stringify(data));

    //todo use nice svlete transition to sjow gap being filled
  };

  const mouseover = () => dragIconVisible = true;
  const mouseout = () => dragIconVisible = false;

  $: iconVisibleStyle = dragIconVisible ? "visibility: visible" : "visibility: hidden";

  $: iconStyle = "font-size: 1.5rem; cursor: move;" + iconVisibleStyle;

</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<div draggable={true} on:mouseover = "{mouseover}" on:mouseout = "{mouseout}" >
  <div

    on:dragstart|stopPropagation={(e) => dragStart(e)}
    on:pointerdown|stopPropagation
  >
    <Icon icon={dragDropLine} style={iconStyle} inline={true} />
  </div>
  <slot />
</div>

<style>
  div {
    display: flex;
    align-items: center;
  }
</style>