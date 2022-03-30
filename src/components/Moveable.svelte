<script>
  let isDragging = false;

  let lastOffsetX = 0;
  let lastOffsetY = 0;

  export let pos;

  export let updateDrag = null;

  let grabbingFrame;

  const pointerdown = (e) => {
    const bringToTop = (elem) => {
      //be careful with this
      //if we unconditionally append the element to the end of the list,
      //we lose mouse events of the child elements
      if (elem !== elem.parentNode.lastElementChild) {
        elem.parentNode.append(elem);
      }
    };

    grabbingFrame.setPointerCapture(e.pointerId);
    
    const thisEl = e.currentTarget;
    bringToTop(thisEl);

    // can't use e.offsetX as it is relative to the bottommost child element
    var rect = thisEl.getBoundingClientRect();
    lastOffsetX = e.clientX - rect.left;
    lastOffsetY = e.clientY - rect.top;

    isDragging = true;
  };

  const pointermove = (e) => {
    if (!isDragging) return;

    pos.left = e.clientX - lastOffsetX;
    pos.top = e.clientY - lastOffsetY;

    updateDrag(pos.left, pos.top);
  };

  const pointerup = (e) => {
    if(grabbingFrame)
      grabbingFrame.releasePointerCapture(e.pointerId);
    isDragging = false;
  }

  $: positionStyle = pos
    ? `left: ${pos.left}px; top: ${pos.top}px; position: absolute;`
    : "";

  $:rotateAboutMouseStyle = isDragging
    ? `transform-origin: ${lastOffsetX}px ${lastOffsetY}px;`
    : "";

  
</script>

<div bind:this={grabbingFrame}
  on:pointerdown={pointerdown}
  on:pointermove={pointermove}
  on:pointerup={pointerup}

  class="drag"
  class:isDragging
  style = {positionStyle + rotateAboutMouseStyle}
>
  <slot />
</div>

<style>
  .drag {
    cursor: move;
    position: absolute;
  }

  .isDragging {
    box-shadow: 22px 23px 27px 15px rgba(0, 0, 0, 0.82);
    transform-origin: 0 0;
    transform: rotateZ(-5deg);
    cursor: grabbing;
  }
</style>
