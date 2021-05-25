import React from 'react'
import {UserIcon} from "@heroicons/react/solid"
import { useHistory } from 'react-router';
import "./HomeNav.scss"
function HomeNav() {
    const history=useHistory();
    return (
        <div className="homeNav">
            <h1>MHPD</h1>  {/* title of the project */}
            <div className="homeNav__right" onClick={()=>{
                document.querySelector('.homeNav__onClick').classList.toggle('active')
            }}>
                <UserIcon className="homeNav__icon" />
                <p>Anbu</p>   {/* display the userName */}
                <div className="downArrow">
                </div>

                <div className="homeNav__onClick">
                    <ul>
                        <li>Settings</li>
                        <li onClick={()=>{
                            history.push('/')
                        }}>Log Out</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default HomeNav