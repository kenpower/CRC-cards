<script>
  let client_id =
    "255830753763-2dhccvuvrd6955g7m1pkipjok8srf1jk.apps.googleusercontent.com";
  //let login_redirect =  "/google_sign_in";
</script>

<svelte:head>
  <script src="https://accounts.google.com/gsi/client" async defer></script>
  <script>
    function decodeJwtResponse(token) {
      var base64Url = token.split(".")[1];
      console.log("token ", token.split("."));
      var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      var jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );

      return JSON.parse(jsonPayload);
    }
    function handleGoogleCredential(response, a, b, c) {
      console.log(a);
      console.log(b);
      console.log(c);

      console.log(response);
      var responsePayload = decodeJwtResponse(response.credential);
      console.log("ID: " + responsePayload.sub);
      console.log("Full Name: " + responsePayload.name);
      console.log("Given Name: " + responsePayload.given_name);
      console.log("Family Name: " + responsePayload.family_name);
      console.log("Image URL: " + responsePayload.picture);
      console.log("Email: " + responsePayload.email);
      console.log("token", responsePayload);

      // localStorage.setItem('ID',responsePayload.sub);
      // localStorage.setItem('Full Name',responsePayload.name);
      // localStorage.setItem('Given Name',responsePayload.given_name);
      // localStorage.setItem('Family Name',responsePayload.family_name);
      // localStorage.setItem('Image URL',responsePayload.picture);
      // localStorage.setItem('Email',responsePayload.email);
      if (typeof window !== "undefined") {
        localStorage.setItem("google-token", JSON.stringify(responsePayload));
        window.location.reload();
      }
    }
  </script>
</svelte:head>

<main>
  <h1 class="mdc-typography--headline1">CRC Cards</h1>
  <h2 class="mdc-typography--subtitle2">Ken Power</h2>
  <div
    id="g_id_onload"
    data-client_id={client_id}
    data-callback="handleGoogleCredential"
    data-auto_prompt="false"
  ></div>
  <div
    class="g_id_signin"
    data-type="standard"
    data-size="large"
    data-theme="outline"
    data-text="sign_in_with"
    data-shape="circle"
    data-width="400"
    data-logo_alignment="left"
  ></div>
</main>

<style>
  main {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    flex-direction: column;
    gap: 2rem;
  }
</style>
