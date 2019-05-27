import React from "react";
import "../css/app.css";
import Route from "react-router-dom/es/Route";
import Switch from "react-router-dom/es/Switch";
import Root from "./Root";
import NavBar from "./modules/Navbar.js";

class App extends React.Component {
  render() {
    return (
      <div>
        <NavBar
        />
        <Switch>
          <Route exact path="/" component={Root} />
        </Switch>
      </div>
    )
    ;
  }
}

export default App;