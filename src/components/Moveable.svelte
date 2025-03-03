<script>
  let isDragging = $state(false);

  let lastOffsetX = $state(0);
  let lastOffsetY = $state(0);

  /**
   * @typedef {Object} Props
   * @property {any} pos
   * @property {any} [updateDrag]
   * @property {import('svelte').Snippet} [children]
   */

  /** @type {Props} */
  let {
    pos = $bindable(),
    updateDrag = null,
    dropped = null,
    children,
  } = $props();

  let grabbingFrame = $state();

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

    const position = {
      left: e.clientX - lastOffsetX,
      top: e.clientY - lastOffsetY,
    };
    updateDrag(position);
  };

  const pointerup = (e) => {
    if (grabbingFrame) grabbingFrame.releasePointerCapture(e.pointerId);
    if (isDragging) dropped();
    isDragging = false;
  };

  let positionStyle = $derived(
    pos ? `left: ${pos.left}px; top: ${pos.top}px; position: absolute;` : ""
  );

  let rotateAboutMouseStyle = $derived(
    isDragging ? `transform-origin: ${lastOffsetX}px ${lastOffsetY}px;` : ""
  );
</script>

<div
  bind:this={grabbingFrame}
  onpointerdown={pointerdown}
  onpointermove={pointermove}
  onpointerup={pointerup}
  class="drag"
  class:isDragging
  style={positionStyle + rotateAboutMouseStyle}
>
  {@render children?.()}
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
