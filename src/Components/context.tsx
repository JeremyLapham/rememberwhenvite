import { createContext } from 'react';

interface MyContextType {
  username: string;
  setUser: (username: string) => void;
  usersId: number;
  setUsersId: (usersId: number) => void;
  memoryItems: any[];
  setMemoryItems: (memoryItems: any[]) => void;
  moreMemoryClicked: boolean;
  setMoreMemoryClicked: (moreMemoryClicked: boolean) => void;
  selectedMemory: any;
  setSelectedMemory: (selectedMemory: any) => void;
  folders: any;
  setFolders: (folders: any) => void;
  folderId: number;
  setFolderId: (folderId: number) => void;
  folderName: string;
  setFolderName: (folderName: string) => void;
  selectedFolder: any;
  setSelectedFolder: (selectedFolder: any) => void;
  folderEdit: any;
  setFolderEdit: (folderEdit: any) => void;
  isEditFolder: boolean;
  setIsEditFolder: (isEditFolder: boolean) => void;
  memoryEdit: any;
  setMemoryEdit: (memoryEdit: any) => void;
  isEditMemory: boolean;
  setIsMemoryEdit: (isEditMemory: boolean) => void;
  fromAddFolder: boolean;
  setFromAddFolder: (fromAddFolder: boolean) => void;
  folderLength: number;
  setFolderLength: (folderLength: number) => void;
  fromAddMemory: boolean;
  setFromAddMemory: (fromAddMemory: boolean) => void;
  audio: any;
  setAudio: (audio: any) => void;
}

export const MyContext = createContext<MyContextType>({
  username: '',
  setUser: () => { },
  usersId: 0,
  setUsersId: () => { },
  memoryItems: [],
  setMemoryItems: () => { },
  moreMemoryClicked: false,
  setMoreMemoryClicked: () => { },
  selectedMemory: {},
  setSelectedMemory: () => { },
  folders: [],
  setFolders: () => { },
  folderId: 0,
  setFolderId: () => { },
  folderName: '',
  setFolderName: () => { },
  selectedFolder: {},
  setSelectedFolder: () => { },
  folderEdit: {},
  setFolderEdit: () => { },
  isEditFolder: false,
  setIsEditFolder: () => { },
  memoryEdit: {},
  setMemoryEdit: () => { },
  isEditMemory: false,
  setIsMemoryEdit: () => { },
  fromAddFolder: false,
  setFromAddFolder: () => { },
  folderLength: 0,
  setFolderLength: () => { },
  fromAddMemory: false,
  setFromAddMemory: () => { },
  audio: '',
  setAudio: () => { },
});

export const resetContext = (
  setUser: (username: string) => void,
  setUsersId: (usersId: number) => void,
  setMemoryItems: (memoryItems: any) => void,
  setMoreMemoryClicked: (moreMemoryClicked: boolean) => void,
  setFolders: (folders: any) => void,
  setIsEditFolder: (isEditFolder: boolean) => void,
  setFolderEdit: (folderEdit: any) => void
) => {
  setUser('');
  setUsersId(0);
  setMoreMemoryClicked(false);
  setFolders([]);
  setFolderEdit('');
  setIsEditFolder(false);
  setMemoryItems([]);
};