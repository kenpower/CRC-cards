<script>
    import { crcCards } from "../stores.js"
    export let card;

    const deleteCard = () => {
        $crcCards = $crcCards.filter(c => c !== card);
        updateDrag();
    }
</script>

<div class = "card">
    <span class="delete" on:click="{deleteCard}">&times;</span>
    <div class="title">
        <h1 
            contenteditable={true} class="editable"
        >{card.title}</h1>
    </div>
    <div class = "body">
        <div class = "responsibilities">
            <ul>
                {#each card.responsibilities as responsibility}
                    <li contenteditable={true} class="editable">{responsibility}</li>
                {/each}
            </ul>
        </div>
        <div class ="vline"/>
        <div class ="collaborators">
            <ul>
                {#each card.collaborators as collaborator}
                    <li contenteditable={true} class="editable" >{collaborator}</li>
                {/each}
            </ul>
        </div>
    </div>
</div>

<style>
  .card {
    user-select: none;
    display: inline-block;
    padding: 1rem;
    background: linear-gradient(to left bottom, #d4fc78, #99e5a2);
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
    color: #00243f;
  }

  .delete {
    color: #0085e8;
    cursor: pointer;
    font-size: 2rem;
    position: absolute;
    right: 0.4rem;
    top: -0.5rem;
  }
  .card .title{
    display: flex;
    justify-content: center;
    align-items: center;
}

    h1{
          text-align: center;
          margin: 0rem;
      }
  .card .body{
      display:flex;
      gap: 1rem; 
      padding-top: 1rem;  
  }

  .responsibilities, .collaborators {
      flex-grow: 1;
  }

  ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}
.vline {
  display: inline-block;
  border-left: 1px solid black;
  width: 0px;
}

.editable{
     cursor: text;
}
</style>