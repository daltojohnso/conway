import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
} from "react-router-dom";
import HomePage from "./components/HomePage";

export default function App() {
  return (
    <Router>
      <div>
        <nav className="py-4 pl-4 flex items-center gap-1">
          <h1 className="inline-block px-4 text-4xl bg-gray-100 shadow-md col-start-1">
            <a
              href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life"
              target="_blank"
              rel="noopener noreferrer"
            >
              Conway's Game of Life
            </a>
          </h1>
          <ul className="inline-flex">
            <li>
              <NavLink
                exact
                className="p-1 m-1"
                activeClassName="bg-white"
                to="/"
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                exact
                className="p-1 m-1"
                activeClassName="bg-white"
                to="/users"
              >
                Users
              </NavLink>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route path="/">
            <HomePage />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
