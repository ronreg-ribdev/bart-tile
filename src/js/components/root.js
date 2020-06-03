import React, { Component } from 'react';
import { BrowserRouter, Route, Link } from "react-router-dom";
import _ from 'lodash';
import { HeaderBar } from "./lib/header-bar.js"

function isSundaySchedule(curTime) {
  // Deliberately switch over the effective day in the middle of the
  // night.
  const dayOfWeek = curTime.getDay();
  const hour = curTime.getHours();
  const isSunday = (dayOfWeek === 0 && hour > 4) || (dayOfWeek === 1 && hour < 4);
  return isSunday;
}

function getOptionsFromStations(stations) {
  return _.map(stations, (station) => {
    const abbr = station.abbr;
    const name = station.name;
    return <option key={abbr} value={abbr}>{name}</option>;
  });
}

class ScheduleWidget extends Component {
  constructor(props) {
    super(props);
    this.state = { station: "" };
  }

  static getDerivedStateFromProps(props, state) {
    if (state.station === "" && props.stations && props.stations[0]) {
      const abbr = props.stations[0].abbr;
      return { station: abbr }
    }
    return null;
  }
  getSchedule(evt) {
    console.log("Get schedule");
    evt.preventDefault();
  }

  changeStation(evt) {
    const value = evt.target.value;
    this.setState({station: value});
  }

  render() {
    const stations = this.props.stations;
    return (<div>
      <form name="getSchedule" onSubmit={this.getSchedule.bind(this)}>
        <select disabled={!stations} name="stations" value={this.state.fromStation} onChange={this.changeStation.bind(this)}>
          { getOptionsFromStations(stations) }
        </select>
        <input type="submit" value="Get schedule"/>
      </form>
    </div>);
  }
}

class ElevatorWidget extends Component {

  statuses() {
    const elevatorStatuses = this.props.elevatorStatuses;
    if (elevatorStatuses.length === 0) {
      return <p>No elevators are known to be out of service.</p>;
    }
    return (<div>
      { _.map(elevatorStatuses, (st, idx) => {
        const desc = st.description['#cdata-section'];
        return <p key={idx}>{desc}</p>;
      })
      }
    </div>);
  }

  render() {
    return (<div className="cf w-100 flex flex-column pa4 ba-m ba-l ba-xl b--gray2 br1 h-100 h-100-minus-40-s h-100-minus-40-m h-100-minus-40-l h-100-minus-40-xl f9 white-d overflow-x-hidden">
        <h1 className="mt0 f8 fw4">BART Info - Elevator status</h1>
        <Link to="/~bartinfo">Route planner</Link>
        { this.statuses() }
    </div>);
  }
}

class TimeScheduleWidget extends Component {
  constructor(props) {
    super(props)
    this.state = { curTime: new Date() };
  }

  componentDidMount() {
    this.timerId = setInterval(() => this.tick(), 1000);
  }
  componentWillUnmount() {
    clearInterval(this.timerId);
  }

  tick() {
    this.setState({curTime: new Date()});
  }

  render() {
    const curTime = this.state.curTime;
    const timeStr = curTime.toLocaleTimeString();
    const serviceStr = isSundaySchedule(curTime) ? "Sunday service" : "Weekday / Saturday service";
    return (<div style={{textAlign: "center"}}>
      <p className="lh-copy measure pt3">Current time: <b>{timeStr}</b></p>
      <p className="lh-copy measure pt3">{serviceStr}</p>
    </div>);
  }
}

class RoutePlanner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fromStation: "",
      toStation: "",
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (state.fromStation === "" && props.stations && props.stations[0]) {
      const abbr = props.stations[0].abbr;
      return { fromStation: abbr, toStation: abbr};
    }
    return null;
  }

  stationSearch(evt) {
    evt.preventDefault();
    api.action("bartinfo", "json", {
      from: this.state.fromStation,
      to: this.state.toStation});
  }

  changeStation(evt) {
    const target = evt.target.name;
    const value = evt.target.value;
    if (target === "fromStation") {
      this.setState({fromStation: value});
    } else if (target === "toStation") {
      this.setState({toStation: value});
    }
  }

  renderStationForm() {
    const receivedStations = this.props.stations;
    return (<form name="bartSearch" onSubmit={this.stationSearch.bind(this)}>
      From:
      <select disabled={!receivedStations} name="fromStation" value={this.state.fromStation} onChange={this.changeStation.bind(this)}>
        { getOptionsFromStations(receivedStations) }
      </select>
      <br/>
      To:
      <select disabled={!receivedStations} name="toStation" value={this.state.toStation} onChange={this.changeStation.bind(this)}>
        { getOptionsFromStations(receivedStations) }
      </select>
      <input type="submit" value="Search"/>
    </form>);
  }

  render() {
    const curTime = this.props.curTime;
    const mapFilename = isSundaySchedule(curTime) ? "BART-Map-Sunday.png" : "BART-Map-Weekday-Saturday.png";
    const mapPath=`/~bartinfo/img/${mapFilename}`;

    return (
      <div className="cf w-100 flex flex-column pa4 ba-m ba-l ba-xl b--gray2 br1 h-100 h-100-minus-40-s h-100-minus-40-m h-100-minus-40-l h-100-minus-40-xl f9 white-d overflow-x-hidden">
        <h1 className="mt0 f8 fw4">BART Info</h1>
        <Link to="/~bartinfo/elevators">Elevator information</Link>
        <div style={{display: "grid", gridTemplateColumns: "66% 34%", gridGap: "10px" }}>
          <div className="topinfo" style={{gridColumn: "1 / 2"}}>
            <TimeScheduleWidget/>
          </div>
          <div className="map" style={{gridColumn: "1", gridRow: "2"}}>
            <img src={mapPath} />
          </div>
          <div className="searchsidebar" style={{gridColumn: "2", gridRow: "2"}}>
            Search scheduled trains:
            { this.renderStationForm() }

            <br/>
            or see the official bart scheduler for a given station, date and time:
            <ScheduleWidget stations={this.props.stations}/>
          </div>
        </div>
      </div>
    );
  }
}


export class Root extends Component {
  constructor(props) {
    super(props);
    this.state = store.state;
    store.setStateHandler((newState) => {
        this.setState(newState);
    });
  }

  render() {
    return (
      <BrowserRouter>
        <div className="absolute h-100 w-100 bg-gray0-d ph4-m ph4-l ph4-xl pb4-m pb4-l pb4-xl">
          <HeaderBar/>
          <Route exact path="/~bartinfo/elevators" render={ () =>
            <ElevatorWidget
              elevatorStatuses={this.state.elevators || []}
            /> }/>
          <Route exact path="/~bartinfo" render={ () =>
            <RoutePlanner
              curTime={new Date() }
              stations={this.state.stations || []}
            /> } />
        </div>
      </BrowserRouter>
    )
  }
}

