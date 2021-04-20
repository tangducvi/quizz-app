import Home from "./components/Home";
import QuizInstructions from "./components/quiz/QuizInstructions";
import Play from "./components/quiz/Play";
import QuizSummary from "./components/quiz/QuizSummary";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";

function App() {
    return (
        <Router>
            <Route path = "/" exact component = {Home} />
            <Route path = "/play/instructions" exact component = {QuizInstructions} />
            <Route path = "/play/quiz" exact component = {Play} />
            <Route path = "/play/result" exact component = {QuizSummary} />
        </Router>
    );
}

export default App;
