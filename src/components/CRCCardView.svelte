<script>
    import { crcCards } from "../stores.js"
    export let card;

    let newResponsibility;
    let newCollaborator;

    const deleteCard = () => {
        $crcCards = $crcCards.filter(c => c !== card);
    }

    const removeEmpty = list => list.filter(s => s.trim() !== "");

    const updateCard = _ =>  {
        card.responsibilities = removeEmpty(card.responsibilities)
        card.collaborators = removeEmpty(card.collaborators)
        refresh();
    }

    const addResponsibility = _ => {
        card.responsibilities = [...card.responsibilities, newResponsibility]
        refresh();
    }
    
    const addCollaborator = _ => {
        card.collaborators = [...card.collaborators, newCollaborator]
        refresh();
    }
    
    const refresh = _ => { 
        newCollaborator = "+ collaborator"
        newResponsibility = "+ responsibility"
        $crcCards = $crcCards
    }

    refresh();
</script>

<div class = "card">
    <span class="delete" on:click="{deleteCard}">&times;</span>
    <div class="title">
        <h1 
            class="editable" contenteditable="true" bind:textContent={card.title} on:input="{updateCard}"
        ></h1>
    </div>
    <div class = "body">
        <div class = "responsibilities">
            <ul>
                {#each card.responsibilities as responsibility}
                    <input type="text" class="editable" contenteditable="true" bind:value={responsibility} on:change="{updateCard}"/>
                {/each}
                <input type="text" class="editable empty" contenteditable="true" bind:value={newResponsibility} on:change="{addResponsibility}"/>
            </ul>
        </div>
        <div class ="vline"/>
        <div class ="collaborators">
            <ul>
                {#each card.collaborators as collaborator}
                    <input type="text" class="editable" contenteditable="true" bind:value={collaborator} on:change="{updateCard}"/>
                    {/each}
                <input type="text" class="editable empty" contenteditable="true" bind:value={newCollaborator} on:change="{addCollaborator}"/>
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
        display: flex;
        flex-direction: column;
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

input.editable{
    display: block;
    cursor: text;
    background-color: transparent;
    border: none;
    flex-grow: 1;
    padding: 0 ;
    margin : 0;
}

.empty{
    color: #777;

}
</style>