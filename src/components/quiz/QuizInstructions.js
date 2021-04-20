import React, { Component, Fragment } from 'react';
import {Link} from 'react-router-dom';
import {Helmet} from 'react-helmet';

export default class QuizInstructions extends Component {
    render() {
        return (
            <Fragment>
                <Helmet>
                    <title>Quiz instructions - Quiz app</title>
                </Helmet>
                <div className = "instructions container">
                    <h1 style = {{color:'#f25287'}}>Hướng dẫn cách chơi</h1>
                    <p>Hãy đảm bảo bạn làm theo đúng hướng dẫn từ đầu đến cuối!!!</p>
                    <ul className = "browser-default" id = "main-list">
                        <li>Trò chơi kéo dài trong 15 phút</li>
                        <li>Mỗi bản gồm 5 câu hỏi</li>
                        <li>Mỗi câu hỏi gồm 4 đáp án</li>
                        <li>Hãy chọn câu trả lời đúng bạn nhé !!!</li>
                    </ul>
                    <br/>
                    <br/>
                    <hr/>
                    <br/>
                    <br/>

                    <p>Bấm vào biểu tượng 
                        <span className="mdi mdi-set-center mdi-24px lifeline-icon" style = {{color : 'green', margin : '0px 5px'}} ></span>
                        để loại bỏ đi 2 phương án sai!
                    </p>

                    <p>Bấm vào biểu tượng 
                        <span className="mdi mdi-lightbulb-on-outline mdi-24px lifeline-icon" style = {{color : 'green', margin : '0px 5px'}}></span>
                        để loại đi 1 phương án sai!
                    </p>

                    <br/>
                    <br/>
                    <Link className = "click-to-play" to = "/play/quiz">Let's do it!!</Link>
                    
                </div>

                
            </Fragment>
        )
    }
}
