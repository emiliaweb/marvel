import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import AppHeader from "../appHeader/AppHeader";
import MainPage from "../pages/MainPage";
import ComicsPage from "../pages/ComicsPage";

import decoration from '../../resources/img/vision.png';

const App = () => {
    return (
        <Router>
            <div className="app">
                <AppHeader/>
                <main>
                    <Switch>
                        <Route exact path="/">
                            <MainPage />
                        </Route>
                        <Route exact path="/comics">
                            <ComicsPage />
                        </Route>
                    </Switch>
                    <img className="bg-decoration" src={decoration} alt="vision"/>
                </main>
            </div>
        </Router>
    )
}

export default App;