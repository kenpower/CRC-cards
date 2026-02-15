import {jwtDecode} from "jwt-decode";

const user_from_login_token = (event) => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      console.log('token found, decoding'); //decode the jwt token

      try {
        // Decode the JWT without verifying it (on the client-side)
        const user = jwtDecode(token);

        user.auth_service_id = user.user_id; //rename user_id to auth_service_id to match the database schema and avoid confusion over which id is which
        delete user.user_id;
        return user;
      } catch (error) {
        console.log('Error decoding login token:', error);
        console.log('token:', token);
      }
    }
    console.log('No token found in URL');
    return null;
};


export const loginUser = async() => {    

    let user = localStorage.getItem("user");
    if (user) {
      console.log('User found in local storage', user);
      return JSON.parse(user);
    }

    const home_url = import.meta.env.VITE_PUBLIC_URL || (window.location.origin + window.location.pathname);
        
    console.log('No user found in local storage, checking for a auth token in url');
    user = user_from_login_token();
    if (user) {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          forename: user.forename,
          surname: user.surname,
          display_name: user.display_name
        })
      });

      if(response.ok){
        const newOrExistingUser = await response.json();
        localStorage.setItem("user", JSON.stringify(newOrExistingUser));
        window.location.href = home_url; //remove the token from query string
        return newOrExistingUser;
      }
      console.error('Error inserting user into database');
      return null;
    }

    console.log('No auth token found, redirecting to login service');

    window.location.href = `https://compucore.itcarlow.ie/auth/sign_in?redirect=${home_url}`;
};
