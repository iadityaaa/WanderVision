import React, { useState, useCallback, useEffect, Suspense } from "react";
import {
  BrowserRouter as Router, // The main router wrapper
  Switch, // To select a particular route
  Route, // For routing different components
  Redirect, // If npne of the routes matches then it acts as a default one
} from "react-router-dom";
// REACT ROUTER DOM (a 3rd party library helps in routing)
// npm i --save react-router-dom@5 --save-exact
// (version 6 of RRD has many changes))
import MainNavigation from "./shared/components/Navigation/MainNavigation"; //Our header
import Users from "./user/pages/Users";
// import NewPlace from "./places/pages/NewPlace";
// import UserPlaces from "./places/pages/UserPlaces";
// import UpdatePlace from "./places/pages/UpdatePlace";
// import Auth from "./user/pages/Auth";

import { AuthContext } from "./shared/context/auth-context";
import LoadingSpinner from "./shared/components/UIElements/LoadingSpinner";

//Lazy loading
const NewPlace = React.lazy(() => {
  return import("./places/pages/NewPlace");
});
const UserPlaces = React.lazy(() => {
  return import("./places/pages/UserPlaces");
});
const UpdatePlace = React.lazy(() => {
  return import("./places/pages/UpdatePlace");
});
const Auth = React.lazy(() => {
  return import("./user/pages/Auth")
});

let logoutTimer;

const App = () => {
  const [token, setToken] = useState(false);
  const [userId, setUserId] = useState(null);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const login = useCallback((uid, token, expirationDate) => {
    setToken(token);
    setUserId(uid);
    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60); //adding 1 hr to the current date time
    setTokenExpirationDate(tokenExpirationDate);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: uid,
        token: token,
        //special kinda string to keep date time safely
        expiration: tokenExpirationDate.toISOString(),
      })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null);
    setUserId(null);
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(
        storedData.userId,
        storedData.token,
        new Date(storedData.expiration)
      );
    }
  }, [login]);

  let routes;

  if (token) {
    routes = (
      //Note: RRD executes from top to bottom and it doesn't stop after a particular path
      //That's why we use switch(Routes) to select either of the below mentioned paths
      <Switch>
        <Route path="/" exact>
          {/* exact property helps to get the exact path */}
          <Users />
        </Route>
        {/* We can create dynamic routes using : ,here colon tells react that the user id can vary and and acc to the user id diff content will be rendered in the User places component*/}
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/places/new" exact>
          <NewPlace />
        </Route>
        <Route path="/places/:placeId" exact>
          <UpdatePlace />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/auth">
          <Auth />
        </Route>
        {/* Insab k alawa koi andr ka chix access krne ka koshish krne pe authenticate krne bolega */}
        <Redirect to="/auth" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        //Double bangs makes it a true false value
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        {/* The header should always appear that's why we Place above the switch statement and without a specific Route path */}
        <MainNavigation />
        {/* main component adds margin of 5rem so the MainNav doesnot overlap with the Routes */}
        <main>
          {" "}
          <Suspense
            fallback={
              <div className="center">
                <LoadingSpinner />
              </div>
            }
          >
            {" "}
            {routes}{" "}
          </Suspense>{" "}
        </main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
//Export default means you want to export only one value the is present by default in your script
