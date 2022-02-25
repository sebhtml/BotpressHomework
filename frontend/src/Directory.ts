import React, { useState } from 'react';
import { endpoint } from './endpoint'

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
  prefixPath: string;
  filePath: string;
  files: FileInfo[];
  collapsed: boolean;
}


export type { DirectoryProps, FileInfo, DirectoryState }

