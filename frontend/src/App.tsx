import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

interface DirectoryProps {
  absolutePath: string;
  files: string[];
}

interface DirectoryState {
  absolutePath: string;
  files: string[];
  collapsed: boolean;
}

function Directory(props: DirectoryProps) {
  const [state, setState] = useState({
    absolutePath: props.absolutePath,
    files: props.files,
    collapsed: false
  });

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

  const directoryContent = <div>{buttonElement}<ul className={
    state.collapsed ? "App-directory-content-hidden" : "App-directory-content-not-hidden"
    }>{listItems}</ul></div>;

  return <div className="App-directory"><h1>{props.absolutePath}</h1>{directoryContent}</div>;
}

interface DirectoriesState{
  initializing: boolean;
  initialized: boolean;
  directories: string[];
};

function Directories(props: any) {
  const [state, setState] = useState({initializing: false, initialized: false, directories: []});

  if (!state.initialized && !state.initializing) {
    setState({
      initializing: true,
      initialized: false,
      directories: []
    });
    fetch("http://localhost:64000/directories")
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
      return <Directory absolutePath={directory} files={["a.txt", "b.txt", "c.txt"]} />
      });
  return <div>{elements}</div>;
}

function App() {
  return <Directories />;
}

export default App;
