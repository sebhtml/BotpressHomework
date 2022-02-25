import React, { useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import { DirectoryProps, FileInfo, DirectoryState } from './Directory'
import { endpoint } from './endpoint'

// path.join is not available by default in React.
const makePath = (...pieces: string[]): string => {
  let output = "";
  for (const piece of pieces) {
    if (output.length > 0) {
      output += "/";
    }
    output += piece;
  }
  return output;
}

function Directory(props: DirectoryProps) {
  const [state, setState] = useState({
    prefixPath: props.prefixPath,
    filePath: props.filePath,
    files: [],
    collapsed: true
  });

  const directoryPath = makePath(state.prefixPath, state.filePath);

  // Fetch state from backend.
  useEffect(() => {
    fetch(endpoint + "/directories/" + encodeURIComponent(directoryPath))
      .then((res) => res.json())
      .then((res) => {
        setState((prevState) => ({
          ...prevState,
          files: res.files
          }));
      }, (err) => {
        // TODO display an error
      });
  }, []);

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

  const buttonText: string = state.collapsed ? "+" : "-";

  const buttonElement = <button onClick={toggle}>{buttonText}</button>;

  const contentClassName = state.collapsed ? "App-directory-content-hidden" : "App-directory-content-not-hidden";

  const directoryContent = <div className={contentClassName}><ul>{listItems}</ul></div>;

  const directoryTitle = <div>{buttonElement} {state.filePath}</div>;

  return <div>{directoryTitle}{directoryContent}</div>;
}


interface DirectoriesState{
  directories: string[];
};

function Directories(props: any) {
  const [state, setState] = useState({directories: []});

  // Fetch state from backend.
  useEffect(() => {
    setState({
      directories: []
    });
    fetch(endpoint + "/directories")
      .then((response) => {
        const payload = response.json();
        return payload;
      })
      .then((response) => {
        setState({
          directories: response.directories
          });
      }, (err) => {
        // TODO display an error
      });
  }, []);

  const elements = state.directories.map((directory) => {
      return <div className="App-directory-panel"><Directory prefixPath={""} filePath={directory} files={[]}/></div>;
      });

  // Sadly, HTML tags <marquee> and <blink> don't exist in ReactJS :-(
  const important = <div><div >IMPORTANT !</div></div>;
  const docker = <div>This cloud-scale app is implemented with a micro-service with Docker by <a href="https://github.com/sebhtml">sebHTML</a> !</div>;
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
