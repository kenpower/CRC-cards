<script>
export let title = "Class Name";
export let collaborators = ["Collaborator 1", "Collaborator 2"];
export let responsibilities =["Responsibility 1", "Responsibility 2"];

let editingTitle = false;

const toggleEdit = _ => editingTitle = !editingTitle;
</script>

<div class = "card">
    <div class="title">
        <h1 
            contenteditable={editingTitle}
            on:click = {toggleEdit}
           
        >{title}</h1>
    </div>
    <div class = "body">
        <div class = "responsibilities">
            <ul>
                {#each responsibilities as responsibility}
                    <li>{responsibility}</li>
                {/each}
            </ul>
        </div>
        <div class ="vline"/>
        <div class ="c">
            <ul>
                {#each collaborators as collaborator}
                    <li>{collaborator}</li>
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
</style>