import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client'


function AddDoctor(props) {
    const [doctorData, setDoctorData] = useState([])
    const [temporaryData, setTemporaryData] = useState([])
    const userData = useSelector(state => state.user.value)
    const socket = useRef()

    useEffect(() => {
        socket.current = io("http://localhost:7000", {
            path: '/notification/',
        })
    })

    useEffect(() => {
        async function getDoctor() {
            const response = await fetch("http://localhost:7000/search/doctor", {
                method: "GET"
            });
            const data = await response.json();
            console.log(data)
            setDoctorData(data)
        }
        return getDoctor();
    }, [])
    const addDoctor = async (doctorId) => {
        const sendData = JSON.stringify({
            patientId: userData.uId,
            doctorId: doctorId
        })
        const response = await fetch('http://localhost:7000/share/addDoctor', {
            method: "POST",
            headers: {
                "Content-type": 'application/json'
            },
            body: sendData
        })
        const { message } = await response.json()
        console.log(message)
        socket.current.volatile.emit('doctorAdd', sendData)
    }
    return (
        <div className="addDoctor" style={{ backgroundColor: 'white', height: '94.5vh', width: '100%' }}>
            <h1 className="addDoctor__heading">Search For Doctors</h1>
            <div className="addDoctor__searchDoctors">
                <input type="search" onChange={(e) => {
                    if (e.target.value != '') {
                        let tempData = [];
                        Object.keys(doctorData).map((key) => {
                            if (doctorData[key].name.includes(e.target.value)) {
                                tempData = [...tempData, doctorData[key]];
                            }
                        })
                        setTemporaryData(tempData)
                    } else {
                        setTemporaryData([]);
                    }
                }}
                    placeholder="Input the name of the doctor"
                />
            </div>
            <div className="addDoctor__searchedData">
                {Object.keys(temporaryData).map((key) => {
                    return (
                        <div key={key} className="shareDocuments__doctorInfo">
                            <div className="shareDocuments__imgBox">
                                <img src={temporaryData[key].photo} alt="Doctor img" className="shareDocuments__doctorImage" />
                            </div>
                            <p>{temporaryData[key].name}</p>
                            <button
                                onClick={(e) => { addDoctor(temporaryData[key].doctorId) }}
                            >Connect to Doctor</button>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}

export default AddDoctor;