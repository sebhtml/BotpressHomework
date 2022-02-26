import React, { useState } from 'react';
import { endpoint } from './endpoint'

interface DirectoryProps {
  prefixPath: string;
  filePath: string;
  expectedVersion: number;
}

// TODO: move FileInfo to a common module and use import it in the frontend and backend.
interface FileInfo {
  fileName: string,
  isDirectory: boolean
};

interface DirectoryState {
  prefixPath: string;
  filePath: string;
  files: FileInfo[];
  collapsed: boolean;
}

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

export default function Directory(props: DirectoryProps) {

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



export type { DirectoryProps, FileInfo, DirectoryState }

