<script>
  let isDragging = false;

  let lastOffsetX = 0;
  let lastOffsetY = 0;

  export let pos;

  export let updateDrag = null;

  let liftOffset = 15;

  const mousedown = (e) => {
    const bringToTop = (elem) => {
      //be careful with this
      //if we unconditionally append the element to the end of the list,
      //we lose mouse events of the child elements
      if (elem !== elem.parentNode.lastElementChild) {
        elem.parentNode.append(elem);
      }
    };
    const draggable = e.currentTarget;

    bringToTop(draggable);

    // can't use e.offsetX as it is relative to the bottommost child element
    var rect = draggable.getBoundingClientRect();
    lastOffsetX = e.clientX - rect.left + liftOffset;
    lastOffsetY = e.clientY - rect.top + liftOffset;

    adjustPositionToGiveLiftingEffect();

    updateDrag(pos.left, pos.top);

    isDragging = true;
  };

  const adjustPositionToGiveLiftingEffect = () => {
    pos.left -= liftOffset;
    pos.top -= liftOffset;

    lastOffsetX += liftOffset;
    lastOffsetY += liftOffset;
  };

  const drag = (e) => {
    if (!isDragging) return;

    pos.left = e.clientX - lastOffsetX;
    pos.top = e.clientY - lastOffsetY;

    updateDrag(pos.left, pos.top);
  };

  $: style = pos
    ? `left: ${pos.left}px; top: ${pos.top}px; position: absolute;}`
    : "";

  const mouseup = (_) => (isDragging = false);
</script>

<div
  on:mousedown={mousedown}
  on:mousemove={drag}
  on:mouseup={mouseup}
  class="drag"
  class:isDragging
  {style}
>
  <slot />
</div>

<style>
  .drag {
    cursor: grab;
    position: absolute;
  }

  .isDragging {
    box-shadow: 22px 23px 27px 15px rgba(0, 0, 0, 0.82);
    transform: rotateZ(-5deg);
  }
</style>
