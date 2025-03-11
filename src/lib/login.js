import {jwtDecode} from "jwt-decode";
import {insertUser} from "./supabase";

// grok instruction fo integrating with supabase auth
// https://grok.com/share/bGVnYWN5_083fe517-8d97-49c3-9e1d-e727c21b9093


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
    console.log('url', window.location);

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
      const newOrExistingUser = await insertUser(user.email, user.forename, user.surname, user.display_name);
      if(newOrExistingUser){
        localStorage.setItem("user", JSON.stringify(newOrExistingUser));
        window.location =home_url;
        return newOrExistingUser;
      }
      console.error('Error inserting user into database');
      return null;
    }

    console.log('No auth token found, redirecting to login service');

    window.location.href = `https://compucore.itcarlow.ie/auth/sign_in?redirect=${home_url}`;
};