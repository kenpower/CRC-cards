<script>
    let isDragging = false;
    
    let lastOffsetX = 0;
    let lastOffsetY = 0;

    export let left;
    export let top;
    export let updateDrag;

    let liftOffset=15;

    const mousedown = e => {
        const bringToTop = elem => {
            //be careful with this
            //if we unconditionally append the element to the end of the list,
            //we lose mouse events of the child elements
            if(elem !== elem.parentNode.lastElementChild) {
                elem.parentNode.append(elem);
            }
        }
        const draggable = e.currentTarget;

        bringToTop(draggable);

        // can't use e.offsetX as it is relative to the bottommost child element
        var rect = draggable.getBoundingClientRect();
        lastOffsetX = e.clientX - rect.left + liftOffset;
        lastOffsetY = e.clientY - rect.top + liftOffset;
        

        adjustPositionToGiveLiftingEffect()

        updateDrag(left, top);

        isDragging = true;
     }

     const adjustPositionToGiveLiftingEffect = () =>{
        left-=liftOffset;
        top-=liftOffset;

        lastOffsetX += liftOffset;
        lastOffsetY += liftOffset;

     }

    const drag = e =>  {
        if (!isDragging) return;

        left = e.clientX - lastOffsetX;
        top = e.clientY - lastOffsetY;

        updateDrag(left, top);
    }

    const mouseup = _ => isDragging = false;

</script>


<div
  on:mousedown = {mousedown}
  on:mousemove = {drag}
  on:mouseup = {mouseup}
    class="drag" class:isDragging
    style="left: {left}px; top: {top}px;">
        <slot></slot>
</div>

<style>
  .drag {
    cursor: grab;
    position: absolute;
  }

  .isDragging{
    box-shadow: 22px 23px 27px 15px rgba(0,0,0,0.82);
    transform: rotateZ(-5deg);
  }

  </style>