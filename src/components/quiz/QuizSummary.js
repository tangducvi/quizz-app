import React, { Component, Fragment } from 'react'
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

export default class QuizSummary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            score: 0,
            numberOfQuestions: 0,
            numberOfAnsweredQuetions: 0,
            correctAnswers: 0,
            wrongAnswers: 0,
            hintsUsed: 0,
            fiftyFiftyUsed: 0
        }
    }

    componentDidMount() {
        const { state } = this.props.location
        this.setState({
            score: (state.score / state.numberOfQuestion) * 100,
            numberOfQuestion: state.numberOfQuestion,
            numberOfAnsweredQuetions: state.correctAnswers + state.wrongAnswers,
            correctAnswers: state.correctAnswers,
            wrongAnswers: state.wrongAnswers,
            hintsUsed: state.hintsUsed,
            fiftyFiftyUsed: state.fiftyFiftyUsed
        })
    }

    render() {
        const { state, score } = this.props.location
        let stats, remark
        if (score <= 50) {
            remark = "Luyện tập nhiều hơn bạn nhé!"
        } else if (score > 50 && score <= 90) {
            remark = "Kiến thức của bạn khá tốt đấy!"
        } else {
            remark = "Bạn thật phi thường!"
        }

        if (state !== undefined) {
            stats = (
                <Fragment >
                    <div className = "total">
                    <div className = "result-icon">
                        <i class="far fa-check-circle"></i>
                    </div>
                    <h1>Bài kiểm tra kết thúc!</h1>
                    <div className="container">
                        <h4>{remark}</h4>
                        <h2 className = "point">Điểm: {this.state.score.toFixed(0)}%</h2>

                        <span className="stat left">Tổng số câu hỏi: </span>
                        <span className="right">{this.state.numberOfQuestion}</span>
                        <br />

                        <span className="stat left">Số câu hỏi đã trả lời: </span>
                        <span className="right">{this.state.numberOfAnsweredQuetions}</span>
                        <br />

                        <span className="stat left">Đúng: </span>
                        <span className="right">{this.state.correctAnswers}</span>
                        <br />

                        <span className="stat left">Sai: </span>
                        <span className="right">{this.state.wrongAnswers}</span>
                        <br />

                        <br />
                    </div>

                    <section className = "result-section">
                        <ul>
                            <li className = "back">
                                <Link className = "back-to-home" to="/">Về trang chủ</Link>
                            </li>
                            <li className = "back">
                                <Link className = "back-to-play" to="/play/quiz">Chơi lại</Link>
                            </li>
                        </ul>
                    </section>
                    </div>
                </Fragment>
            )
        } else {
            stats = (
                < section >
                    <h1 className="no-stats">Chưa có kết quả!</h1>
                    <ul>
                        <li>
                            <Link to="/">Về trang chủ</Link>
                        </li>
                        <li>
                            <Link to="/play/quiz">Chơi lại</Link>
                        </li>
                    </ul>
                </section >
            )

        }
        return (
            <Fragment>
                <Helmet>
                    <title>Quizzz result</title>
                </Helmet>
                {stats}
            </Fragment>
        )
    }
}
