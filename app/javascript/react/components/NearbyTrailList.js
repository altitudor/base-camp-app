import React, { useState, useEffect } from "react";

import FavoriteComponent from "./FavoriteComponent";
import CompletedTrailComponent from "./CompletedTrailComponent";

import Loader from 'react-loader-spinner';
import {CircleArrow as ScrollUpButton} from "react-scroll-up-button";

const NearbyTrailList = (props) => {
  const [ trails, setTrails ] = useState([]);
  const [ showLoader, setShowLoader ] = useState(false)

  useEffect(() => {
    const lat = props.coords.latitude;
    const lon = props.coords.longitude;
    if (typeof lat === "undefined" || typeof lon === "undefined"){
      return
    }
    setShowLoader(true)
    fetch(`/api/v1/nearby_trails_data?lat=${lat}&lon=${lon}`)
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
        if (body.trails) {
          let trailData = body.trails;
          setTrails(trailData);
          setShowLoader(false)
        }
      })
      .catch((error) => console.error(`Error in fetch: ${error.message}`));
  }, [props.coords]);

  let loader = <></>
  if (showLoader === true) {
  loader = <Loader
       type="RevolvingDot"
       color="#80BDEB"
       height={100}
       width={100}
       timeout={3000} //3 secs
    />
  }

  let trailsInfo;
  trailsInfo = trails.map((trail)=> {
    let favorite = <></>
    let completed = <></>

    if (props.user.id && trail) {
    favorite = <FavoriteComponent
          api_id={trail.id}
        />;
    completed = <CompletedTrailComponent
          api_id={trail.id}
        />;
    }

    return(
      <div key={trail.id} className="grid-container no-padding">
        <div className="grid-x grid-margin-x">
          {favorite}{completed}
          <h4 className="small-8 large-10">{trail.name}</h4>
          <div>
          <img src={trail.imgSmallMed}/>
          </div>
        </div>
        <h5>Trail Information:</h5>
        <ul>
          <li>Location: {trail.location}</li>
          <li>Description: {trail.summary}</li>
          <li>Trail Length: {trail.length}</li>
          <li>Ascent: {trail.ascent}</li>
          <li>Trail Condition: {trail.conditionStatus}</li>
          <li>Condition Details: {trail.conditionDetails}</li>
        </ul>
      </div>
    )
  })

  return (
    <div>
      <div>
        <div>{loader}</div>
        <h3>Nearby Trails:</h3>
            {trailsInfo}
      </div>
      <div>
        <ScrollUpButton />
      </div>
    </div>
  )
}

export default NearbyTrailList;
