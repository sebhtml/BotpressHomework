import React, { useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import { DirectoryProps, FileInfo, DirectoryState } from './Directory'
import Directory from './Directory'
import { endpoint } from './endpoint'

interface DirectoryVersion {
  directoryName: string;
  expectedVersion: number;
};

interface DirectoriesState{
  directories: DirectoryVersion[];
};

function Directories(props: any) {
  const noDirectories: DirectoriesState = {directories: []};
  const [state, setState] = useState(noDirectories);

  // Fetch state from backend.
  useEffect(() => {
    setState({
      directories: []
    });

    // Listen to SSE events.
    let source = new EventSource(`${endpoint}/events`);
    source.onmessage = (event) => {
      const directoryPath: string = JSON.parse(event.data).directoryPath;
      setState((prevState) => {
        let newState = { ...prevState };
        for (let directoryVersion of newState.directories) {
          if (directoryPath.startsWith(directoryVersion.directoryName)) {
            ++directoryVersion.expectedVersion;
          }
        }
        return newState;
      });
    };

    fetch(`${endpoint}/directories`)
      .then((response) => {
        const payload = response.json();
        return payload;
      })
      .then((response) => {
        const initialDirectories: DirectoriesState = {
          directories: response.directories.map((x: string) => ({directoryName: x, expectedVersion: 1}))
        };
        setState(initialDirectories);
      }, (err) => {
        console.log("Failed to fetch directories list.");
      });
  }, []);

  const elements = state.directories.map((directoryVersion) => {
    const expectedVersion = directoryVersion.expectedVersion;
    const directory: string = directoryVersion.directoryName;
    return <div key={directory} className="App-directory-panel"><Directory prefixPath={""} filePath={directory} expectedVersion={expectedVersion} /></div>;
  });

  // Sadly, HTML tags <marquee> and <blink> don't exist in ReactJS :-(
  const important = <div><div >IMPORTANT !</div></div>;
  const docker = <div>This cloud-scale app is implemented with a micro-service with Docker by <a href="https://github.com/sebhtml">sebHTML</a> !</div>;
  const reactMessage = <div><u><b>This is a very good looking UI done in ReactJS !</b></u></div>;
  const directoryLists = state.directories.map((directoryVersion) => {
    const directory: string = directoryVersion.directoryName;
    return <li key={directory}>{directory}</li>;
  });

  return <div className="App-main">{important}{docker}{reactMessage}<ol>{directoryLists}</ol><div>{elements}</div></div>;
}

function App() {
  return <Directories />;
}

export default App;
