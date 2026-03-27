<script>
  import "../app.css";
  import "material-icons/iconfont/material-icons.css";
  let { children } = $props();
</script>

{@render children()}

<style>
  :global(html) {
    box-sizing: border-box;
    font-family: "Courier New", Courier, monospace;
  }
</style>
