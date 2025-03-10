import {jwtDecode} from "jwt-decode";

// grok instruction fo integrating with supabase auth
// https://grok.com/share/bGVnYWN5_083fe517-8d97-49c3-9e1d-e727c21b9093


const user_from_login_token = (event) => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      console.log('token found, decoding'); //decode the jwt token
      const AUTH_SERVICE_JWT_SECRET_KEY = import.meta.env.AUTH_SERVICE_JWT_SECRET_KEY;

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


export const loginUser = () => {    
    const user = localStorage.getItem("user");
        
    if (!user) {
    console.log('No user found in local storage');
    const user = user_from_login_token();
    if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        debugger;
        return user;
    }
    else{
        console.log('No auth token found, redirecting to login service');
        const home_url = import.meta.env.PUBLIC_URL || window.location.origin;
        const redirect_url = home_url;
        debugger;
        window.location.href = `https://compucore.itcarlow.ie/auth/sign_in?redirect=${redirect_url}`;
    }
    }
};