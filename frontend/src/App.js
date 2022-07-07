import React from "react";
import Navigation from "./components/Navigation";
import "./css/App.css";

export default function App() {
    return (
        <div className="App">
            <div className="app_container absolute_center">
                <Navigation />
                Hello World;
            </div>
        </div>
    );
}
