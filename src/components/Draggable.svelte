<script>
    let isDragging = false;
    
    let lastOffsetX = 0;
    let lastOffsetY = 0;
    
    export let containedElement;
    export let updateDrag;

    const mousedown = e => {
        const bringToTop = elem => elem.parentNode.append(elem);

        const draggable = e.currentTarget;

        bringToTop(draggable);

        // can't use e.offsetX as it is relative to the bottommost child element
        var rect = draggable.getBoundingClientRect();
        lastOffsetX = e.clientX - rect.left;
        lastOffsetY = e.clientY - rect.top;

        isDragging = true;
     }

    const drag = e =>  {
        if (!isDragging) return;

        containedElement.left = e.clientX - lastOffsetX;
        containedElement.top = e.clientY - lastOffsetY;

        updateDrag();
    }

    const mouseup = _ => isDragging = false;

</script>


<div
  on:mousedown = {mousedown}
  on:mousemove = {drag}
  on:mouseup = {mouseup}
    class="drag"
    style="left: {containedElement.left}px; top: {containedElement.top}px;">
        <slot></slot>
</div>

<style>
  .drag {
    cursor: grab;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    position: absolute;

  }

  </style>