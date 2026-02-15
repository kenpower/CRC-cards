<script>
    const {fullname="? ?", forename=null, surname=null, email = ""} = $props();
  
    // Function to get initials
    function getInitials() {
        if(forename && surname) return forename[0] + surname[0];
        if(fullname) return fullname.split(" ").map(n => n[0]).join("");
    }

    let tooltipVisible = $state(false);
    let tooltipX = $state(0);
    let tooltipY = $state(0);
    let tooltipWidth = 150; // Estimated width of tooltip
    let tooltipHeight = 50; // Estimated height
  
    function showTooltip(event) {
    tooltipVisible = true;
    let viewportWidth = window.innerWidth;
    let viewportHeight = window.innerHeight;

    let x = event.clientX + 10; // Default right offset
    let y = event.clientY + 10; // Default below offset

    // Adjust if tooltip goes off-screen horizontally
    if (x + tooltipWidth > viewportWidth) {
      x = viewportWidth - tooltipWidth - 10; // Push left
    }

    // Adjust if tooltip goes off-screen vertically
    if (y + tooltipHeight > viewportHeight) {
      y = event.clientY - tooltipHeight - 10; // Show above instead
    }

    tooltipX = x;
    tooltipY = y;
  }
    function hideTooltip() {
        tooltipVisible = false;
    }

    let initials = getInitials();
  </script>
  
  <style>
    .profile-circle {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background-color: #4a90e2; /* Adjust color as needed */
      color: white;
      font-size: 20px;
      font-weight: bold;
      font-family: sans-serif;
    }

    .tooltip {
    position: fixed;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 8px 12px;
    border-radius: 5px;
    font-size: 14px;
    white-space: nowrap;
    pointer-events: none; /* Prevents interference with other elements */
    transition: opacity 0.2s ease-in-out;
    opacity: 0;
  }

  .tooltip.visible {
    opacity: 1;
  }
  </style>
  
  <div   
    role="button"
    tabindex="0"
    class="profile-circle"
    onmouseenter={showTooltip}
    onmouseleave={hideTooltip}
>
  {initials}
</div>

{#if tooltipVisible}
  <div
    class="tooltip visible"
    style="top: {tooltipY}px; left: {tooltipX}px;"
  >
    <strong>{fullname}</strong><br />
    {email}
  </div>
{/if}
  