import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import TrailTile from "../components/TrailTile";

const TrailsIndexContainer = (props) => {
  const [trails, setTrails] = useState([]);

  const fetchTrails = () => {
    fetch("/api/v1/trails")
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
        setTrails(body.trails);
      })
      .catch((error) => console.error(`Error in fetch: ${error.message}`));
  };

  useEffect(() => {
    fetchTrails();
  }, []);

  let deleteClick = (event, trail_id) => {
    event.preventDefault();
    trail_id = event.currentTarget.id;
    fetch(`/api/v1/trails/${trail_id}`, {
      credentials: "same-origin",
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          fetchTrails();
        } else {
          let errorMessage = `${response.status} (${response.statusText})`;
          let error = new Error(errorMessage);
          throw error;
        }
      })
      .catch((error) => console.error(`Error in fetch: ${error.message}`));
  };

  let trailTiles;
  if (trails.length === 0) {
    trailTiles = (
      <div>
        <p>No trails yet</p>
      </div>
    );
  } else {
    trailTiles = trails.map((trail) => {
      return (
        <TrailTile
          key={trail.id}
          trail={trail}
          user={trail.user}
          deleteClick={deleteClick}
        />
      );
    });
  }

  let addTrail;
  if (props.user) {
    addTrail = (
      <Link className="button" to="/trails/new">
        Add a Trail
      </Link>
    );
  } else {
    addTrail = <></>;
  }

  let nearbyTrails = (
      <div className="nearby">
      <Link className="button" to="/trails/nearby">
        Current Conditions and Nearby Trails
      </Link>
      </div>
    );

  let welcome = (
    <div className="welcome">
      Find Your Next <br>
      </br>Adventure...
    </div>
  ) 

  return (
    <div>
      <div className="grid-container">
        <div className="grid-x grid-margin-x">
          <div className="cell small-3 callout">
            {nearbyTrails}
          </div>
          <div className="cell small-6"
            >{welcome}
          </div>
          <div className="cell small-3 callout">
            <h3>Popular Trails:</h3>
            {addTrail}
            {trailTiles}   
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default TrailsIndexContainer;


