import React, { useState, useEffect } from "react";

import UsersList from "../components/UsersList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

const Users = () => {
  //USERS is the array of objects where each object is a seperate user Having different properties
  //Users is a page which will display the component UsersList
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedUsers, setLoadedUsers] = useState([]);
  //Here we want to render the data whenever the page laods but it will also load when we get res or change something which is not good so we will use use effect hook
  //use effect allows us to run a code only when the dependencies change
  //Don't use async await on the useEffect function since useEffect doesnot expect a promise and all async func returns a promise.
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users`
        );

        setLoadedUsers(responseData.users);
      } catch (err) {}
    };
    fetchUsers();
  }, [sendRequest]); //send req is a dependency here that's why we wrapped the hook using callback function else
  //whenever SR will change sendReeq will again be called an dthen it will again change SR which will give us an infinite loop

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedUsers && <UsersList items={loadedUsers} />};
    </React.Fragment>
  );
};

export default Users;
