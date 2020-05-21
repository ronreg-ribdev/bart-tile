import React, { Component } from 'react';
import { BrowserRouter, Route } from "react-router-dom";
import _ from 'lodash';
import { HeaderBar } from "./lib/header-bar.js"


export class Root extends Component {
  constructor(props) {
    super(props);

    this.state = { fromValue: "ashby", toValue: "24th" };
  }

  action() {
    console.log("Clickin'");
  }

  render() {

    return (
      <BrowserRouter>
        <div className="absolute h-100 w-100 bg-gray0-d ph4-m ph4-l ph4-xl pb4-m pb4-l pb4-xl">
        <HeaderBar/>
        <Route exact path="/~bartinfo" render={ () => {
          return (
            <div className="cf w-100 flex flex-column pa4 ba-m ba-l ba-xl b--gray2 br1 h-100 h-100-minus-40-s h-100-minus-40-m h-100-minus-40-l h-100-minus-40-xl f9 white-d overflow-x-hidden">
              <h1 className="mt0 f8 fw4">BART Info</h1>
              <div style={{display: "grid", gridTemplateColumns: "66% 34%", gridGap: "10px" }}>
                <div className="topinfo" style={{gridColumn: "1 / 2"}}>
                  <p className="lh-copy measure pt3">Current time is (current time)</p>
                  <p className="lh-copy measure pt3">Today's bart map:</p>
                </div>
                <div className="map" style={{gridColumn: "1", gridRow: "2"}}>
                  <img src="/~bartinfo/img/BART-Map-Weekday-Saturday.png" />
                </div>
                <div className="searchsidebar" style={{gridColumn: "2", gridRow: "2"}}>
                  Search scheduled trains:
                  <form name="bartSearch">
                    From:
                    <select value={this.state.fromValue}>
                        <option value="ashby">Ashby</option>
                        <option value="fremont">Fremont</option>
                    </select>
                    <br/>
                    To:
                    <select value={this.state.toValue}>
                        <option value="ashby">Ashby</option>
                        <option value="fremont">Fremont</option>
                        <option value="24th">24th st</option>
                    </select>
                  </form>
                  <button onClick={this.action.bind(this)}>Search</button>
                </div>
              </div>
            </div>
          )}}
        />
        </div>
      </BrowserRouter>
    )
  }
}

