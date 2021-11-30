import "./App.css";
import "mapbox-gl/dist/mapbox-gl.css";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { useState, useEffect, useRef, useCallback } from "react";
import MapGL, { Marker, Popup, NavigationControl } from "react-map-gl";
import Geocoder from "react-map-gl-geocoder";
import RoomIcon from "@material-ui/icons/Room";
import {axiosInstance} from "./util";
import { format } from "timeago.js";
import Register from "./components/Register";
import Login from "./components/Login";

function App() {
  const myStorage = window.localStorage;
  const [currentUsername, setCurrentUsername] = useState(
    myStorage.getItem("user")
  );
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [image, setImage] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const mapRef = useRef();
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 46,
    longitude: 17,
    zoom: 4,
  });

  useEffect(() => {
    const getPins = async () => {
      try {
        const allPins = await axiosInstance.get("/pins");
        setPins(allPins.data);
      } catch (err) {
        console.log(err);
      }
    };
    getPins();
  }, []);

  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id);
    setViewport({ ...viewport, latitude: lat, longitude: long });
  };
  const handleAddClick = (e) => {
    const [longitude, latitude] = e.lngLat;
    setNewPlace({
      lat: latitude,
      long: longitude,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUsername,
      title,
      desc,
      image,
      lat: newPlace.lat,
      long: newPlace.long,
    };
    console.log(newPin);
    try {
      const res = await axiosInstance.post("/pins", newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    myStorage.removeItem("user");
    setCurrentUsername(null);
  };

  const uploadImage = async (e) => {
    try {
      const file = e.target.files[0];
      const base64 = await convertBase64(file);
      setImage(base64);
    } catch (error) {
      console.log(error);
    }
  };
  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleViewportChange = useCallback(
    (newViewport) => setViewport({ ...viewport, ...newViewport }),
    []
  );
  const handleGeocoderViewportChange = useCallback(
    (newViewport) => {
      const geocoderDefaultOverrides = { transitionDuration: 1000 };

      return handleViewportChange({
        ...newViewport,
        ...geocoderDefaultOverrides,
      });
    },
    [handleViewportChange]
  );

  return (
    <div className="App">
      <MapGL
        {...viewport}
        ref={mapRef}
        width="100vw"
        height="100vh"
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
        mapStyle="mapbox://styles/bariskayhan/ckwe5jx8w4xc516o78elmd8rh"
        onViewportChange={handleViewportChange}
        onDblClick={handleAddClick}
        transitionDuration="200"
      >
        <NavigationControl style={{ left: 34, bottom: 40, zIndex: 2 }} />
        {pins.map((p) => (
          <>
            <Marker
              latitude={p.lat}
              longitude={p.long}
              offsetLeft={-viewport.zoom * 3.5}
              offsetTop={-viewport.zoom * 7}
            >
              <RoomIcon
                style={{
                  fontSize: viewport.zoom * 7,
                  color:
                    p.username === currentUsername ? "tomato" : "slateblue",
                  cursor: "pointer",
                }}
                onClick={() => handleMarkerClick(p._id, p.lat, p.long)}
              />
            </Marker>
            {p._id === currentPlaceId && (
              <Popup
                latitude={p.lat}
                longitude={p.long}
                closeButton={true}
                closeOnClick={false}
                anchor="left"
                onClose={() => setCurrentPlaceId(null)}
              >
                <div className="card">
                  <label>Bird</label>
                  <h4 className="place">{p.title}</h4>
                  <img src={p.image} className="image" />
                  <label>Observation</label>
                  <p className="desc">{p.desc}</p>
                  <label>Information</label>
                  <span className="username">
                    Created by <b>{p.username}</b>
                  </span>
                  <span className="date">{format(p.createdAt)}</span>
                </div>
              </Popup>
            )}
          </>
        ))}
        {newPlace && currentUsername && (
          <Popup
            latitude={newPlace.lat}
            longitude={newPlace.long}
            closeButton={true}
            closeOnClick={false}
            onClose={() => setNewPlace(null)}
            anchor="left"
          >
            <div>
              <form onSubmit={handleSubmit}>
                <label>Type of Bird</label>
                <input
                  type="text"
                  placeholder="Enter a Title"
                  onChange={(e) => setTitle(e.target.value)}
                />
                <label>Observations</label>
                <textarea
                  placeholder="YourComments"
                  onChange={(e) => setDesc(e.target.value)}
                ></textarea>
                <input
                  className="custom-file-input"
                  type="file"
                  accept=".png, .jpg, .jpeg"
                  name="file"
                  onChange={uploadImage}
                />
                <button type="submit" className="submitButton">
                  Add Pin
                </button>
              </form>
            </div>
          </Popup>
        )}
        {currentUsername ? (
          <button className="button logout" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <div className="buttons">
            <button className="button login" onClick={() => setShowLogin(true)}>
              Login
            </button>
            <button
              className="button register"
              onClick={() => setShowRegister(true)}
            >
              Register
            </button>
          </div>
        )}
        {showRegister && <Register setShowRegister={setShowRegister} />}
        {showLogin && (
          <Login
            setShowLogin={setShowLogin}
            myStorage={myStorage}
            setCurrentUsername={setCurrentUsername}
          />
        )}
        <Geocoder
          mapRef={mapRef}
          onViewportChange={handleGeocoderViewportChange}
          mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
          position="top-left"
        ></Geocoder>
      </MapGL>
    </div>
  );
}

export default App;
