import React, { useContext } from 'react'
import { Context } from "../store/appContext";
import { Link } from 'react-router-dom';
export default function UserDetails(props) {
    
    const { store, actions } = useContext(Context);
    return (
        <div>
            <ul class="nav nav-pills nav-fill">
                <li class="nav-item">
                    <a class="nav-link active mb-3" role="tab" aria-current="page" aria-controls="info" data-bs-toggle="tab" href="#info">Profile Information</a>
                </li>
                <li class="nav-item" role="presentation" >
                    <a class="nav-link" role="tab" href="#rewards" aria-controls="rewards" data-bs-toggle="tab">Rewards</a>
                </li>
                <li class="nav-item" role="presentation" >
                    <a class="nav-link" role="tab" href="#friends" aria-controls="friends" data-bs-toggle="tab">Friends</a>
                </li>
                <li class="nav-item" role="presentation" >
                    <a class="nav-link" role="tab" href="#privacy" aria-controls="rewards" data-bs-toggle="tab">Privacy</a>
                </li>
                <li class="nav-item" role="presentation" >
                    <a class="nav-link" role="tab" href="#settings" aria-controls="settings" data-bs-toggle="tab">Settings</a>
                </li>
            </ul>

            <div class="tab-content">
                <div role="tabpanel" aria-labelledby="info" tabindex="0" class="tab-pane fade show active" id="info">
                    {/* <p>Name: {store.userData&&store.userData.name} </p> */}
                    <p>Email: {store.userEmail} </p>
                </div>
                <div role="tabpanel" aria-labelledby="rewards" tabindex="0" class="tab-pane fade" id="rewards">
                    <div className="mt-1"> 
                        <h2>Point History</h2>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Action</th>
                                    <th>Points</th>
                                    <th>Timestamp</th>
                                </tr>
                            </thead>
                            <tbody>
                                {props.pointHistory.map((entry, index) => (
                                    <tr key={index}>
                                        <td>{entry.action}</td>
                                        <td>{entry.points}</td>
                                        <td>{new Date(entry.timestamp).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div role="tabpanel" aria-labelledby="friends" tabindex="0" class="tab-pane fade" id="friends">John Doe</div>
                <div role="tabpanel" aria-labelledby="privacy" tabindex="0" class="tab-pane fade" id="privacy"><input className='me-2' id='datashare' type='checkbox'></input><label htmlFor='datashare'>Do not share my data</label></div>
                <div role="tabpanel" aria-labelledby="settings" tabindex="0" class="tab-pane fade" id="settings">
                <div className="mt-5 "><Link className='btn btn-secondary' to="/forgot-password">Change My Password</Link></div> {/* stay here */}
                </div>
            </div>
        </div>
    )
}
