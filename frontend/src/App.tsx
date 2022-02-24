import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

interface DirectoryProps {
  absolutePath: string;
  files: string[];
}

function Directory(props: DirectoryProps) {
  const listItems = props.files.map((filename) =>
    <li>{filename}</li>
    );

  return <div><h1>{props.absolutePath}</h1><ul>{listItems}</ul></div>;
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
