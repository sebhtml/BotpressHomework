import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

const endpoint: string = "http://localhost:64000";

interface DirectoryProps {
  prefixPath: string;
  filePath: string;
  files: string[];
}

// TODO: move FileInfo to a common module and use import it in the frontend and backend.
interface FileInfo {
  fileName: string,
  isDirectory: boolean
};

interface DirectoryState {
  initializing: boolean;
  initialized: boolean;
  prefixPath: string;
  filePath: string;
  files: FileInfo[];
  collapsed: boolean;
}

function Directory(props: DirectoryProps) {
  const [state, setState] = useState({
    prefixPath: props.prefixPath,
    filePath: props.filePath,
    files: [],
    collapsed: true,
    initializing: false,
    initialized: false
  });

  // TODO use path.join
  const directoryPath = state.prefixPath + "/" + state.filePath;

  // Fetch state from backend.
  if (!state.initialized && !state.initializing) {
    setState((prevState) => ({
      ...prevState,
      initializing: true,
      initialized: false
    }));

    // TODO use path.join
    fetch(endpoint + "/directories/" + encodeURIComponent(directoryPath))
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



  const listItems = state.collapsed ? "" : state.files.map((fileInfo: FileInfo) => {
    const fileName = fileInfo.fileName;
    const isDir: boolean = fileInfo.isDirectory;

    if (isDir) {
      return <li><Directory prefixPath={directoryPath} filePath={fileName} files={[]}/></li>;
    }
    return <li>{fileName}</li>
  });

  const toggle = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setState((prevState) => ({
      ...prevState,
      collapsed: !prevState.collapsed
    }));
  };

  const buttonElement = <button onClick={toggle}>[Collapse/Uncollapse]</button>;

  const contentClassName = state.collapsed ? "App-directory-content-hidden" : "App-directory-content-not-hidden";

  const directoryContent = <div className={contentClassName}><ul>{listItems}</ul></div>;

  const directoryTitle = <div className="App-directory-title">{state.filePath} {buttonElement}</div>;

  return <div className="App-directory">{directoryTitle}{directoryContent}</div>;
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
      return <Directory prefixPath={""} filePath={directory} files={[]}/>
      });

  // Sadly, HTML tags <marquee> and <blink> don't exist in ReactJS :-(
  const important = <div><div >IMPORTANT !</div></div>;
  const docker = <div>This cloud-scale app is implemented with micro-services with Docker by <a href="https://github.com/sebhtml">sebHTML</a> !</div>;
  const reactMessage = <div><u><b>This is a very good looking UI done in ReactJS !</b></u></div>;
  const directoryLists = state.directories.map((directory) => {
    return <li>{directory}</li>;
  });

  return <div className="App-main">{important}{docker}{reactMessage}<ol>{directoryLists}</ol><div>{elements}</div></div>;
}

function App() {
  return <Directories />;
}

export default App;
