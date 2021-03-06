import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import TrailsIndexContainer from "../containers/TrailsIndexContainer";
import TrailsNewContainer from "../containers/TrailsNewContainer";
import TrailShowContainer from "../containers/TrailShowContainer";
import NearbyTrailsContainer from "../containers/NearbyTrailsContainer";
import UserShowContainer from "../containers/UserShowContainer";

export const App = (props) => {
  const loggedOutUser = {
    id: 0,
    admin: false,
    user_name: ""
  };

  let [user, setUser] = useState(loggedOutUser);

  useEffect(() => {
    fetch(`/api/v1/user`)
      .then((response) => {
        if (response.ok) {
          return response;
        } else {
          let errorMessage = `${response.status} (${response.statusText})`;
          let error = new Error(errorMessage);
          throw error;
        }
      })
      .then((response) => response.json())
      .then((body) => {
        if (body && body.user) {
          setUser(body.user);
        } else {
          setUser(loggedOutUser);
        }
      })
      .catch((error) => console.error(`Error in fetch: ${error.message}`));
  }, []);

  return (
    <div>
      <BrowserRouter>
        <Switch>
          <Route exact
                 path="/"
                 render={(props) => <TrailsIndexContainer {...props} user={user} />}/>
          <Route exact
                 path="/trails"
                 render={(props) => <TrailsIndexContainer {...props} user={user}/>}/>
          <Route exact
                 path="/trails/new"
                 render={(props) => <TrailsNewContainer {...props} user={user}/>}/>
         <Route exact
               path="/trails/nearby"
               render={(props) => <NearbyTrailsContainer {...props} user={user}/>}/>
          <Route exact
                path="/trails/:id"
                render={(props) => <TrailShowContainer {...props} user={user}/>}/>
          <Route exact
                path="/users/:id"
                render={(props) => <UserShowContainer {...props} user={user}/>}/>
        </Switch>
      </BrowserRouter>
    </div>
  );
};

export default App;
