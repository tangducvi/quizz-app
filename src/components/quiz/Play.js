import React, { Component, Fragment } from 'react';
import { Helmet } from 'react-helmet';
import questions from '../../questions.json';
import isEmpty from '../../utils/is-empty';
import M from 'materialize-css';
import correctSound from '../../assets/audio/correct-answer.mp3';
import wrongSound from '../../assets/audio/wrong-answer.mp3';
import buttonSound from '../../assets/audio/button-sound.mp3'
import classNames from 'classnames';

export default class Play extends Component {
    constructor(props) {
        super(props);
        this.state = {
            questions: questions,
            currentQuestion: {},
            nextQuestion: {},
            preQuestion: {},
            answer: '',
            numberOfQuestion: 0,
            numberOfAnsweredQuetions: 0,
            currentQuestionIndex: 0,
            score: 0,
            correctAnswers: 0,
            wrongAnswers: 0,
            hints: 5,
            fiftyFifty: 2,
            usedFiftyFifty: false,
            nextButtonDisabled: false,
            preButtonDisabled: true,
            preRandomNumber: [],
            time: {}
        }
        this.interval = null;
        this.correctSound = React.createRef();
        this.wrongSound = React.createRef();
        this.buttonSound = React.createRef();
    }

    componentDidMount() {
        const { questions, currentQuestion, nextQuestion, preQuestion } = this.state
        this.displayQuestions(questions, currentQuestion, nextQuestion, preQuestion)
        this.startTimer()
    }

    componentWillUnmount() {
        clearInterval(this.interval)
    }

    displayQuestions = (questions = this.state.questions, currentQuestion, nextQuestion, preQuestion) => {
        let { currentQuestionIndex } = this.state
        if (!isEmpty(this.state.questions)) {
            questions = this.state.questions
            currentQuestion = questions[currentQuestionIndex]
            nextQuestion = questions[currentQuestionIndex + 1]
            preQuestion = questions[currentQuestionIndex - 1]

            const answer = currentQuestion.answer
            this.setState({
                currentQuestion,
                nextQuestion,
                preQuestion,
                answer,
                preRandomNumber: [],
                numberOfQuestion: questions.length
            }, () => {
                this.showOptions()
                this.handleDisabledButton()
            })
        }
    }

    handleNextButtonClick = () => {
        this.playButtonSound()
        if (this.state.nextQuestion !== undefined) {
            this.setState(preState => ({
                currentQuestionIndex: preState.currentQuestionIndex + 1
            }), () => {
                this.displayQuestions(this.state.questions, this.state.currentQuestion, this.state.nextQuestion, this.state.preQuestion)
            })
        }
    }

    handlePreButtonClick = () => {
        this.playButtonSound()
        if (this.state.preQuestion !== undefined) {
            this.setState(preState => ({
                currentQuestionIndex: preState.currentQuestionIndex - 1
            }), () => {
                this.displayQuestions(this.state.questions, this.state.currentQuestion, this.state.nextQuestion, this.state.preQuestion)
            })
        }
    }

    handleQuitButtonClick = () => {

        if (window.confirm('Bạn muốn thoát chứ?')) {
            this.props.history.push('/') // trở về trang có đường dẫn truyền vào
        }
    }

    handleButtonClick = (e) => {
        switch (e.target.id) {
            case 'next-button':
                this.handleNextButtonClick();
                break;
            case 'pre-button':
                this.handlePreButtonClick();
                break;
            case 'quit-button':
                this.handleQuitButtonClick();
                break;
            default:
                break;
        }
    }

    playButtonSound = () => {
        document.getElementById('button-sound').play()
    }

    handleOptionClick = (e) => {
        if (e.target.innerHTML.toLowerCase() === this.state.answer.toLowerCase()) {
            setTimeout(() => {
                this.correctSound.current.play()
            }, 300)
            this.correctAnswer()
        } else {
            setTimeout(() => {
                this.wrongSound.current.play()
            }, 300)
            this.wrongAnswer()
        }
    }

    wrongAnswer = () => {
        navigator.vibrate(1000)
        M.toast({
            html: 'Sai rùi nè!',
            classes: 'toast-valid-wrong',
            displayLength: 1500
        })

        this.setState(preState => ({
            wrongAnswers: preState.wrongAnswers + 1,
            currentQuestionIndex: preState.currentQuestionIndex + 1,
            numberOfAnsweredQuetions: preState.numberOfAnsweredQuetions + 1
        }), () => {
            if (this.state.nextQuestion === undefined) {
                this.endGame()
            } else {
                this.displayQuestions(this.state.questions, this.state.currentQuestion, this.state.nextQuestion, this.state.preQuestion)
            }
        })
    }

    correctAnswer = () => {
        M.toast({
            html: 'Chính xác!',
            classes: 'toast-valid-correct',
            displayLength: 1500
        })

        this.setState(preState => ({
            score: preState.score + 1,
            correctAnswers: preState.correctAnswers + 1,
            currentQuestionIndex: preState.currentQuestionIndex + 1,
            numberOfAnsweredQuetions: preState.numberOfAnsweredQuetions + 1
        }), () => {
            if (this.state.nextQuestion === undefined) {
                this.endGame()
            } else {
                this.displayQuestions(this.state.questions, this.state.currentQuestion, this.state.nextQuestion, this.state.preQuestion)
            }
        })
    }

    showOptions = () => {
        const options = Array.from(document.querySelectorAll('.option'));
        options.forEach(option => {
            option.style.visibility = 'visible';
        })

        this.setState({
            usedFiftyFifty: false
        })
    }

    handleHints = () => {
        if (this.state.hints > 0) {
            const options = Array.from(document.querySelectorAll('.option'))
            let indexOfAnswer;
            options.forEach((option, index) => {
                if (option.innerHTML.toLowerCase() === this.state.answer.toLowerCase()) {
                    indexOfAnswer = index
                }
            })

            while (true) {
                const randomNumber = Math.round(Math.random() * 3)
                if (randomNumber !== indexOfAnswer && !this.state.preRandomNumber.includes(randomNumber)) {
                    options.forEach((option, index) => {
                        if (index === randomNumber) {
                            option.style.visibility = 'hidden'
                            this.setState((preState) => ({
                                hints: preState.hints - 1,
                                preRandomNumber: preState.preRandomNumber.concat(randomNumber)
                            }))
                        }
                    })
                    break;
                }

                if (this.state.preRandomNumber.length >= 3) break;
            }
        }
    }

    handleFiftyFifty = () => {
        const options = document.querySelectorAll('.option')
        const randomNumbers = []
        let indexOfAnswer

        options.forEach((option, index) => {
            if (option.innerHTML.toLowerCase() === this.state.answer.toLowerCase()) {
                indexOfAnswer = index
            }
        })

        let count = 0;
        do {
            const randomNumber = Math.round(Math.random() * 3)
            if (randomNumber !== indexOfAnswer) {
                if (randomNumbers.length < 2 && !randomNumbers.includes(randomNumber) && !randomNumbers.includes(indexOfAnswer)) {
                    randomNumbers.push(randomNumber)
                    count++
                } else {
                    while (true) {
                        const newRandomNumber = Math.round(Math.random() * 3)
                        if (!randomNumbers.includes(newRandomNumber) && !randomNumbers.includes(indexOfAnswer)) {
                            randomNumbers.push(newRandomNumber)
                            count++
                            break
                        }
                    }
                }
            }
        } while (count < 2)

        options.forEach((option, index) => {
            if (randomNumbers.includes(index)) {
                option.style.visibility = 'hidden'
            }
        })

        this.setState({
            fiftyFifty: this.state.fiftyFifty - 1,
            usedFiftyFifty: true
        })
    }

    startTimer = () => {
        const countDownTime = Date.now() + 180000;
        this.interval = setInterval(() => {
            const now = new Date()
            const distance = countDownTime - now
            const minutes = Math.floor(distance % (1000 * 60 * 60) / (1000 * 60))
            const seconds = Math.floor(distance % (1000 * 60) / 1000)
            if (distance < 0) {
                clearInterval(this.interval)
                this.setState({
                    time: {
                        minutes: 0,
                        seconds: 0
                    }
                }, () => {
                    this.endGame()
                })
            } else {
                this.setState({
                    time: {
                        minutes,
                        seconds
                    }
                })
            }
        }, 1000)
    }

    handleDisabledButton = () => {
        if (this.state.preQuestion === undefined || this.state.currentQuestionIndex === 0) {
            this.setState({
                preButtonDisabled: true
            })
        } else {
            this.setState({
                preButtonDisabled: false
            })
        }

        if (this.state.nextQuestion === undefined || this.state.currentQuestionIndex + 1 === this.state.numberOfQuestion) {
            this.setState({
                nextButtonDisabled: true
            })
        } else {
            this.setState({
                nextButtonDisabled: false
            })
        }
    }

    endGame = () => {
        alert('Trò chơi kết thúc!')
        const { state } = this
        const playerStats = {
            score: state.score,
            numberOfQuestion: state.numberOfQuestion,
            numberOfAnsweredQuetions: state.numberOfAnsweredQuetions,
            correctAnswers: state.correctAnswers,
            wrongAnswers: state.wrongAnswers,
            fiftyFiftyUsed: 2 - state.fiftyFifty,
            hintsUsed: 5 - state.hints,
        }

        //console.log(playerStats)
        setTimeout(() => {
            this.props.history.push('/play/result', playerStats)
        }, 1000)
    }

    render() {
        const { fiftyFifty, currentQuestion, currentQuestionIndex, numberOfQuestion, hints, time } = this.state
        return (
            <Fragment>
                <Helmet><title>Quiz page</title></Helmet>

                <Fragment>
                    <audio ref= {this.correctSound} src={correctSound}></audio>
                    <audio ref= {this.wrongSound} src={wrongSound}></audio>
                    <audio ref= {this.buttonSound} src={buttonSound}></audio>
                </Fragment>

                <div className="questions">

                    <h2>Chọn đáp án đúng đấy nhé!</h2>

                    <div className="lifeline-container">
                        <p>
                            <span onClick={this.handleFiftyFifty} className="mdi mdi-set-center mdi-24px lifeline-icon">
                                <span className="lifeline">{fiftyFifty}</span>
                            </span>
                        </p>

                        <p>
                            <span onClick={this.handleHints} className="mdi mdi-lightbulb-on-outline mdi-24px lifeline-icon">
                                <span className="lifeline">{hints}</span>
                            </span>
                        </p>
                    </div>

                    <div className="timer-container">
                        <p>
                            <span className="left">{currentQuestionIndex + 1} of {numberOfQuestion}</span>
                            <span className="right"> {time.minutes} : {time.seconds}
                                <span className="mdi mdi-clock-outline mdi-24px lifeline-icon"></span>
                            </span>
                        </p>
                    </div>

                    <h5 className = "questions-detail">{currentQuestion.question}</h5>
                    <div className="options-container">
                        <p onClick={this.handleOptionClick} className="option">{currentQuestion.optionA}</p>
                        <p onClick={this.handleOptionClick} className="option">{currentQuestion.optionB}</p>
                    </div>
                    <div className="options-container">
                        <p onClick={this.handleOptionClick} className="option">{currentQuestion.optionC}</p>
                        <p onClick={this.handleOptionClick} className="option">{currentQuestion.optionD}</p>
                    </div>

                    <div className="button-container">
                        <button
                            className={classNames('', { 'disabled': this.state.preButtonDisabled })}
                            id="pre-button"
                            onClick={this.handleButtonClick}>
                            Quay lại
                        </button>
                        <button
                            className={classNames('', { 'disabled': this.state.nextButtonDisabled })}
                            id="next-button"
                            onClick={this.handleButtonClick}>
                            Tiếp
                        </button>
                        <button
                            id="quit-button"
                            onClick={this.handleButtonClick}>
                            Thoát
                        </button>
                    </div>
                </div>
            </Fragment>
        )
    }
}
