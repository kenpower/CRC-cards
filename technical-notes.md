# Get data from dynamo flow

### load google sign in library

`<script src="https://accounts.google.com/gsi/client" async defer></script>`

### Display the Sign In With Google button and handle response

```
// https://developers.google.com/identity/gsi/web/guides/handle-credential-responses-js-functions
<div id="g_id_onload"
     data-client_id="YOUR_GOOGLE_CLIENT_ID"
     data-callback="handleCredentialResponse">
</div>
<script>
  function handleCredentialResponse(response) {
     // decodeJwtResponse() is a custom function defined by you
     // to decode the credential response.
     const responsePayload = decodeJwtResponse(response.credential);

     console.log("ID: " + responsePayload.sub);
     console.log('Full Name: ' + responsePayload.name);
     console.log('Given Name: ' + responsePayload.given_name);
     console.log('Family Name: ' + responsePayload.family_name);
     console.log("Image URL: " + responsePayload.picture);
     console.log("Email: " + responsePayload.email);
  }
</script>
```

### Get AWS Cognito creds

https://docs.aws.amazon.com/cognito/latest/developerguide/google.html#set-up-google-1.javascript


### allow creds to acces db item

https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_examples_dynamodb_items.html


