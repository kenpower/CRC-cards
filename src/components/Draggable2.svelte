<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    let { dropped = () => {}, card } = $props();

    let isDragging = $state(false);
    let x = $state(0);
    let y = $state(0);
    let startX = 0;
    let startY = 0;
    let lastOffsetX = 0;
    let lastOffsetY = 0;
    let element;
    let cardPosition = { left: 0, top: 0 };

    function handleMouseDown(e) {
        const bringToTop = (elem) => {
            //be careful with this
            //if we unconditionally append the element to the end of the list,
            //we lose mouse events of the child elements
            if (elem !== elem.parentNode.lastElementChild) {
                elem.parentNode.append(elem);
            }
        };
        isDragging = true;
        // startX = e.clientX - e.x;
        // startY = e.clientY - e.y;
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);

        var rect = element.getBoundingClientRect();
        lastOffsetX = e.clientX - rect.left;
        lastOffsetY = e.clientY - rect.top;
        console.log("handleMouseDown event", e);
        console.log("handleMouseDown rect", rect);
        console.log("handleMouseDown", lastOffsetX, lastOffsetY);

        bringToTop(element);
    }

    function handleMouseMove(e) {
        if (!isDragging) return;
        x = e.clientX - lastOffsetX;
        y = e.clientY - lastOffsetY;
        // cardPosition = {
        //     left: e.clientX - lastOffsetX,
        //     top: e.clientY - lastOffsetY,
        // };
        //element.style.transform = `translate(${x}px, ${y}px)`;
        element.style.left = `${x}px`;
        element.style.top = `${y}px`;
        //const rect = element.getBoundingClientRect();
        const rect = element.getBoundingClientRect();

        console.log("handleMouseMove", x, y);
        //console.log("offset parent", element.offsetParent);
    }

    function handleMouseUp(e) {
        if (!isDragging) return;
        isDragging = false;

        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);

        const rect = element.getBoundingClientRect();

        x = e.clientX - lastOffsetX;
        y = e.clientY - lastOffsetY;
        console.log("handleMouseUp", x, y);
        dropped(x, y);

        dispatch("drop", {
            id: element.id,
            position: { x, y },
            element: element,
        });
    }
</script>

<div
    bind:this={element}
    class="draggable {isDragging ? 'dragging' : ''}"
    on:mousedown={handleMouseDown}
    style="position: absolute; cursor: move;  left: {card.style.position
        .left}px;top: {card.style.position.top}px;"
>
    <slot />
</div>

<style>
    .draggable {
        transition:
            box-shadow 0.3s,
            transform 0.3s;
        /* box-shadow: 0px 0px 0px 0px rgba(0,0,0,0); */
        box-shadow: 0;
        position: relative;
        user-select: none;
        touch-action: none;
    }
    .dragging {
        transform: rotate(-5deg);
        box-shadow: 20px 22px 7px 0px rgba(0, 0, 0, 0.44);
    }
</style>
