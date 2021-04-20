
import React, { Component, Fragment } from 'react';
import {Helmet} from 'react-helmet';
import { Link } from 'react-router-dom';

export default class Home extends Component {
    render() {
        return (
            <Fragment>
                <Helmet>
                    <title>Quizz for fun</title>
                </Helmet>
                <div id = "home">
                    <section>
                        <div style = {{textAlign : "center", marginTop: "2rem"}}>
                            <span><i className="fas fa-cubes cube" /></span>
                        </div>

                        <h1>Giải trí tý đi bạn...</h1>

                        <div className = "play-button-container">
                            <ul>
                                <li>
                                    <Link className = "play-button" to= "/play/instructions">Play</Link>
                                </li>
                            </ul>
                        </div>

                        {/* <div className = "auth-container">
                            <Link to = "/login" className = "auth-buttons" id = "login-button">Login</Link>
                            <Link to = "/register" className = "auth-buttons" id = "signup-button">Register</Link>
                        </div> */}
                    </section>
                </div>
                
            </Fragment>
        )
    }
}
