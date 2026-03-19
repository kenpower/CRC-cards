import {jwtDecode} from "jwt-decode";
import { base } from '$app/paths';

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


const upsertUserInDB = async (userData) => {
  const response = await fetch(`${base}/api/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: userData.email,
      forename: userData.forename,
      surname: userData.surname,
      display_name: userData.display_name
    })
  });
  if (!response.ok) return null;
  return await response.json();
};

export const loginUser = async() => {
    const home_url = import.meta.env.VITE_PUBLIC_URL || (window.location.origin + window.location.pathname);

    // Handle fresh login via token in URL
    const tokenUser = user_from_login_token();
    if (tokenUser) {
      console.log('Auth token found, upserting user in database');
      const dbUser = await upsertUserInDB(tokenUser);
      if (dbUser) {
        localStorage.setItem("user", JSON.stringify(dbUser));
        window.location.href = home_url; // remove token from query string
        return dbUser;
      }
      console.error('Error inserting user into database');
      return null;
    }

    // Re-verify stored user against DB (handles DB resets, stale IDs, etc.)
    const stored = localStorage.getItem("user");
    if (stored) {
      console.log('User found in local storage, re-verifying with database');
      const cachedUser = JSON.parse(stored);
      const dbUser = await upsertUserInDB(cachedUser);
      if (dbUser) {
        localStorage.setItem("user", JSON.stringify(dbUser));
        return dbUser;
      }
      // Upsert failed — clear stale data and force re-authentication
      console.warn('Could not verify user with database, clearing local storage and re-authenticating');
      localStorage.removeItem("user");
      window.location.href = `https://compucore.itcarlow.ie/auth/sign_in?redirect=${home_url}`;
      return null;
    }

    console.log('No auth token found, redirecting to login service');
    window.location.href = `https://compucore.itcarlow.ie/auth/sign_in?redirect=${home_url}`;
};
