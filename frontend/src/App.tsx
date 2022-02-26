import React, { useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import { DirectoryProps, FileInfo, DirectoryState } from './Directory'
import { endpoint } from './endpoint'

// path.join is not available by default in React.
const makePath = (...pieces: string[]): string => {
  let output = "";
  for (const piece of pieces) {
    if (output.length > 0 && output[output.length - 1] !== "/") {
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

  const [actualVersion, setActualVersion] = useState(0);
  const [expectedVersion, setExpectedVersion] = useState(actualVersion + 1);

  if (expectedVersion !== props.expectedVersion) {
    setExpectedVersion(props.expectedVersion);
  }

  const directoryPath = makePath(state.prefixPath, state.filePath);
  const directoryURIComponent = encodeURIComponent(directoryPath);

  const fetchState = () => {
    const path = `${endpoint}/directories/${directoryURIComponent}`;
    fetch(path)
      .then((res) => res.json())
      .then((res) => {
        setState((prevState) => ({
          ...prevState,
          files: res.files
          }));
      }, (err) => {
      });
  };

  const addWatcher = async () => {
    const rawResponse = await fetch(`${endpoint}/directories/${directoryURIComponent}/watch`,
    {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify({watch: true})
    });
  };

  if (!state.collapsed && (actualVersion < expectedVersion)) {
    fetchState();
    setActualVersion(expectedVersion);
    addWatcher();
  }

  const listItems = state.collapsed ? "" : state.files.map((fileInfo: FileInfo) => {
    const fileName = fileInfo.fileName;
    const isDir: boolean = fileInfo.isDirectory;

    if (isDir) {
      return <li key={fileName}><Directory prefixPath={directoryPath} filePath={fileName} expectedVersion={expectedVersion} /></li>;
    }
    return <li key={fileName}>{fileName}</li>
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
      console.log("Got event for " + directoryPath);
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
