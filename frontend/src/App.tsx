import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

const endpoint: string = "http://localhost:64000";

interface DirectoryProps {
  absolutePath: string;
  files: string[];
}

interface DirectoryState {
  initializing: boolean;
  initialized: boolean;
  absolutePath: string;
  files: string[];
  collapsed: boolean;
}

function Directory(props: DirectoryProps) {
  const [state, setState] = useState({
    absolutePath: props.absolutePath,
    files: [],
    collapsed: false,
    initializing: false,
    initialized: false
  });

  // Fetch state from backend.
  if (!state.initialized && !state.initializing) {
    setState((prevState) => ({
      ...prevState,
      initializing: true,
      initialized: false
    }));
    fetch(endpoint + "/directories/" + state.absolutePath.replaceAll("/", "%2F"))
      .then((res) => res.json())
      .then((res) => {
        setState((prevState) => ({
          ...prevState,
          initializing: false,
          initialized: true,
          files: res.files
          }));
      }, (err) => {
        // TODO display an error
      });
  }



  const listItems = state.collapsed ? "" : state.files.map((filename) =>
    <li>{filename}</li>
    );

  const toggle = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setState((prevState) => ({
      ...prevState,
      collapsed: !prevState.collapsed
    }));
  };

  const buttonElement = <button onClick={toggle}>[Collapse/Uncollapse]</button>;

  const directoryContent = <div><ul className={
    state.collapsed ? "App-directory-content-hidden" : "App-directory-content-not-hidden"
    }>{listItems}</ul></div>;

  return <div className="App-directory"><div>{props.absolutePath} {buttonElement}</div>{directoryContent}</div>;
}

interface DirectoriesState{
  initializing: boolean;
  initialized: boolean;
  directories: string[];
};

function Directories(props: any) {
  const [state, setState] = useState({initializing: false, initialized: false, directories: []});

  // Fetch state from backend.
  if (!state.initialized && !state.initializing) {
    setState({
      initializing: true,
      initialized: false,
      directories: []
    });
    fetch(endpoint + "/directories")
      .then((response) => {
        const payload = response.json();
        return payload;
      })
      .then((response) => {
        setState({
          initializing: false,
          initialized: true,
          directories: response.directories
          });
      }, (err) => {
        // TODO display an error
      });
  }

  const elements = state.directories.map((directory) => {
      return <Directory absolutePath={directory} files={[]}/>
      });

  // Sadly, HTML tags <marquee> and <blink> don't exist in ReactJS :-(
  const important = <div><div >IMPORTANT !</div></div>;
  const docker = <div>This cloud-scale app is implemented with micro-services with Docker !</div>;
  const reactMessage = <div><u><b>This is a very good looking UI done in ReactJS !</b></u></div>;

  return <div>{important}{docker}{reactMessage}<div>{elements}</div></div>;
}

function App() {
  return <Directories />;
}

export default App;
