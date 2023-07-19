import React, { useState, useCallback } from "react";
import {
  BrowserRouter as Router, // The main router wrapper
  Switch, // To select a particular route
  Route, // For routing different components
  Redirect, // If npne of the routes matches then it acts as a default one
} from "react-router-dom";
// REACT ROUTER DOM (a 3rd party library helps in routing)
// npm i --save react-router-dom@5 --save-exact
// (version 6 of RRD has many changes))

import Users from "./user/pages/Users";
import NewPlace from "./places/pages/NewPlace";
import UserPlaces from "./places/pages/UserPlaces";
import UpdatePlace from "./places/pages/UpdatePlace";
import Auth from "./user/pages/Auth";
import MainNavigation from "./shared/components/Navigation/MainNavigation"; //Our header
import { AuthContext } from "./shared/context/auth-context";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);

  const login = useCallback((uid) => {
    setIsLoggedIn(true);
    setUserId(uid);
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setUserId(null);
  }, []);

  let routes;

  if (isLoggedIn) {
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
        isLoggedIn: isLoggedIn,
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        {/* The header should always appear that's why we Place above the switch statement and without a specific Route path */}
        <MainNavigation />
        {/* main component adds margin of 5rem so the MainNav doesnot overlap with the Routes */}
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
//Export default means you want to export only one value the is present by default in your script
