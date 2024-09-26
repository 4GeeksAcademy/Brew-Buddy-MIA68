import React, { useContext } from 'react'
import { Context } from "../store/appContext";
import { Link } from 'react-router-dom';
export default function UserDetails(props) {

    const { store, actions } = useContext(Context);
    return (
        <div className='mt-5'>
            <ul className="nav nav-pills nav-fill">
                <li className="nav-item">
                    <a className="nav-link profile-nav-link active mb-3" role="tab" aria-current="page" aria-controls="info" data-bs-toggle="tab" href="#info">Profile Information</a>
                </li>
                <li className="nav-item" role="presentation" >
                    <a className="nav-link profile-nav-link" role="tab" href="#rewards" aria-controls="rewards" data-bs-toggle="tab">Points & Rewards</a>
                </li>
                <li className="nav-item" role="presentation" >
                    <a className="nav-link profile-nav-link" role="tab" href="#privacy" aria-controls="rewards" data-bs-toggle="tab">Privacy</a>
                </li>
                <li className="nav-item" role="presentation" >
                    <a className="nav-link profile-nav-link" role="tab" href="#settings" aria-controls="settings" data-bs-toggle="tab">Settings</a>
                </li>
            </ul>

            <div className="tab-content">
                <div role="tabpanel" aria-labelledby="info" tabindex="0" className="tab-pane fade show active" id="info">
                    {/* <p>Name: {store.userData&&store.userData.name} </p> */}
                    <p>Email: {store.userEmail} </p>
                </div>
                <div role="tabpanel" aria-labelledby="rewards" tabindex="0" className="tab-pane fade" id="rewards">
                    <div className="mt-1 row d-flex container">
                        <div className="col-6">
                            <h2 className="fw-bold">Point History</h2>
                            <table className="table table-warning">
                                <thead className="table-light">
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
                        <div className="col-6">
                        <h2 className="fw-bold">Reward History</h2>
                            <table className="table table-warning">
                                <thead className="table-light">
                                    <tr>
                                        <th>Reward Name</th>
                                        <th>Reward Type</th>
                                        <th>Reward Value</th>
                                        <th>Point Cost</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {store.userRewards.map((reward, index) => (
                                        <tr key={index}>
                                            <td>{reward.reward_name}</td>
                                            <td>{reward.reward_type}</td>
                                            <td>{reward.reward_value}</td>
                                            <td>{reward.point_cost}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div role="tabpanel" aria-labelledby="privacy" tabindex="0" className="tab-pane fade" id="privacy"><input className='me-2' id='datashare' type='checkbox'></input><label htmlFor='datashare'>Do not share my data</label></div>
                <div role="tabpanel" aria-labelledby="settings" tabindex="0" className="tab-pane fade" id="settings">
                    <div className="mt-5 ">
                        <button className="btn btn-primary">
                            <Link to="/forgot-password" className="link-light link-offset-2 link-underline-opacity-25 link-underline-opacity-75-hover">
                                Change My Password
                            </Link>
                        </button>
                    </div> {/* stay here */}
                </div>
            </div>
        </div>
    )
}
