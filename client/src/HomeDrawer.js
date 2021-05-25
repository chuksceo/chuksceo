import React from 'react'
import { useHistory } from 'react-router';
import "./HomeDrawer.scss"
function HomeDrawer() {
    const history=useHistory();
    return (
        <div className="homeDrawer">
            <ul>
                <li>Profile</li>
                <li>Lists</li>
                <li onClick={()=>{
                    history.push('home/documents')
                }}>Patient Documents</li>
                <li>Reports</li>
                <li>Logout</li>
            </ul>
            <div className="homeDrawer__button"
            onClick={()=>{
                document.querySelector(".homeDrawer").classList.toggle("active");
            }}
            >
               <h1>|||</h1>
            </div>
        </div>
    )
}

export default HomeDrawer