<script>
  export let data = {};
  let draggedMember = null;
  let focused = false;

  // see here (modify to make dragable work) https://svelte.dev/repl/b225504c9fea44b189ed5bfb566df6e6?version=3.46.4

  const dragStart = (event) => {
    //remove();

    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", JSON.stringify(data));
    //event.dataTransfer.setDragImage(event.target.firstChild, 0, 0);
    console.log(event);
    //text="";

    //todo use nice svlete transition to sjow gap being filled
    //setTimeout(()=> edit("", id), 500); //remove after 500ms
  };

  // const drag = (event, member, idx) => {
  //     draggedMember = idx;
  //     text=text;
  // }
</script>

<div draggable={true} 
  on:dragstart|stopPropagation={(e) => dragStart(e)}>
    <slot />
</div>

<style>
</style>
