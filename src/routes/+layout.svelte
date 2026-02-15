<script>
  import "../app.css";
  let { children } = $props();
</script>

{@render children()}

<style>
  :global(html) {
    box-sizing: border-box;
    font-family: "Courier New", Courier, monospace;
  }
</style>
