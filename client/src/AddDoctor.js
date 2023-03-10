import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import "./AddDoctor.scss";

function AddDoctor(props) {
  const [doctorData, setDoctorData] = useState([]);
  const [temporaryData, setTemporaryData] = useState([]);
  const userData = useSelector((state) => state.user.value);
  const socket = useRef();
  let darkMode = useSelector((state) => state.user.darkMode)
  
  useEffect(() => {
    socket.current = io("http://localhost:7000", {
      path: "/notification/",
    });
  }, []);
  useEffect(() => {
    async function getDoctor() {
      const response = await fetch(
        `http://localhost:7000/search/doctor?patientId=${userData?.uId}`,
        {
          method: "GET",
        }
      );
      const data = await response.json();
      console.log(data);
      setDoctorData(data);
    }
    return getDoctor();
  }, []);
  const addDoctor = async (doctorId) => {
    const sendData = JSON.stringify({
      patientId: userData.uId,
      doctorId: doctorId,
      photo: userData.photo,
    });
    const response = await fetch("http://localhost:7000/share/addDoctor", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: sendData,
    });
    const { message } = await response.json();
    alert(message);
    socket.current.volatile.emit("doctorAdd", sendData);
  };
  return (
    <div
      className="addDoctor"
      style={{ backgroundColor: "white", height: "94.5vh", width: "100%" }}
    >
      <div className="addDoctor__layout">
        <h1 className="addDoctor__heading">Search For Doctors</h1>
        <div className="addDoctor__searchDoctors">
          <input
            className="addDoctor__search"
            type="search"
            onChange={(e) => {
              if (e.target.value != "") {
                let tempData = [];
                Object.keys(doctorData).map((key) => {
                  if (doctorData[key].name.toUpperCase().includes(e.target.value.toUpperCase())) {
                    tempData = [...tempData, doctorData[key]];
                  }
                });
                setTemporaryData(tempData);
              } else {
                setTemporaryData([]);
              }
            }}
            placeholder="Enter Doctor Name"
          />
        </div>
      </div>
      <div className="addDoctor__searchedData">
        {Object.keys(temporaryData).map((key) => {
          if(temporaryData[key].status === "accepted"){
          return (
            <div key={key} className="addDoctor__doctorInfo">
              <div className="addDoctor__imgBox">
                <img
                  src={temporaryData[key].photo}
                  alt="Doctor img"
                  className={`addDoctor__doctorImage ${darkMode && "addDoctor__imgDark"}`}
                />
              </div>
              <p>{temporaryData[key].name}</p>
              <button
                  className="addDoctor__searchedData__button"
                  style={{backgroundColor:"white"}}
                  disabled
                >
                  Connected
                </button>
            </div>
          );}else{
            return (
              <div key={key} className="addDoctor__doctorInfo">
                <div className="addDoctor__imgBox">
                  <img
                    src={temporaryData[key].photo}
                    alt="Doctor img"
                    className={`addDoctor__doctorImage ${darkMode && "addDoctor__imgDark"}`}
                  />
                </div>
                <p>{temporaryData[key].name}</p>
                {temporaryData[key].status==="rejected"?(<button
                  className="addDoctor__searchedData__button"
                  style={{backgroundColor:"red"}}
                  disabled
                >
                  Rejected</button>):(
              <button
                className="addDoctor__searchedData__button"
                onClick={(e) => {
                  addDoctor(temporaryData[key].doctorId);
                }}
              >
                Connect to Doctor
              </button>
                )}
              </div>
            );
          }

        })}
      </div>
    </div>
  );
}

export default AddDoctor;
