import React from 'react';
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

interface DirectoriesProps {
  directories: string[]
};

function Directories(props: DirectoriesProps) {
  //return <img />;
  const elements = props.directories.map((directory) => {
      return <Directory absolutePath={directory} files={["a.txt", "b.txt", "c.txt"]} />
      });
  return <div>{elements}</div>;
  /*
  */
}

function App() {
  return <Directories directories={["/boot", "/proc", "/home"]} />;
}

export default App;
