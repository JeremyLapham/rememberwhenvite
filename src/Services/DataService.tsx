let userData: {userId:number, publisherName: string};
// const api = 'https://rememberwhenagain.azurewebsites.net/';

export async function createAccount(createdUser: { Id: number; Username: string; Password: string; }) {
    const res = await fetch('https://rememberwhenagain.azurewebsites.net/User/adduser', {
        method: "POST",
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify(createdUser)
    });
    if (!res.ok) {
        const message = `An Error has Occured ${res.status}`;
        throw new Error(message);
    }
    let data = await res.json();
    return data;
}

export async function login(loginUser: { Username: string; Password: string; }) {
    const res = await fetch('https://rememberwhenagain.azurewebsites.net/User/Login', {
        method: "POST",
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify(loginUser)
    });

    if (!res.ok) {
        const message = `An Error has Occured ${res.status}`;
        throw new Error(message);
    }

    let data = await res.json();
    return data;
}

export async function Folder(folder: object) {
    const res = await fetch('https://rememberwhenagain.azurewebsites.net/Folder/AddFolder', {
        method: "POST",
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify(folder)
    });

    if (!res.ok) {
        const message = `An Error has Occured ${res.status}`;
        throw new Error(message);
    }

    let data = await res.json();
    return data;
}

export async function GetLoggedInUserData(username: string) {
    let res = await fetch(`https://rememberwhenagain.azurewebsites.net/User/userbyusername/${username}`);
    let data = await res.json();
    userData = data;
    return userData
}

export function checkToken() {
    let result = false;
    let lsData = localStorage.getItem('Token');
    if (lsData != null) {
        result = true;
    }
    return result;
}

export function loggedInData() {
    return userData;
}

export async function addMemoryItem(memoryItem: object) {
    const res = await fetch('https://rememberwhenagain.azurewebsites.net/Memory/AddMemoryItem', {
        method: "POST",
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify(memoryItem)
    });
    if (!res.ok) {
        const message = `An Error has Occured ${res.status}`;
        throw new Error(message);
    }
    let data = await res.json();
    return data;
}

export async function getMemoryItemsByUserId(userid: number) {
    let res = await fetch(`https://rememberwhenagain.azurewebsites.net/Memory/GetItemsByUserId/${userid}/false`);
    let data = await res.json();
    return data;
}

export async function getFolderByUserId(userid: number) {
    let res = await fetch(`https://rememberwhenagain.azurewebsites.net/Folder/GetFoldersByUserId/${userid}/false`);
    let data = await res.json();
    return data;
}
export async function getMemoryByFolderId(folderId: number) {
    let res = await fetch(`https://rememberwhenagain.azurewebsites.net/Memory/GetItemsByFolderId/${folderId}/false`);
    let data = await res.json();
    return data;
}

export async function updateMemoryItem(memoryItem: object) {
    const res = await fetch('https://rememberwhenagain.azurewebsites.net/Memory/UpdateMemoryItem', {
        method: "PUT",
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify(memoryItem)
    });
    if (!res.ok) {
        const message = `An Error has Occured ${res.status}`;
        throw new Error(message);
    }
    let data = await res.json();
    return data;
}

export async function updateFolder(folder: object) {
    const res = await fetch('https://rememberwhenagain.azurewebsites.net/Folder/UpdateFolder', {
        method: "PUT",
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify(folder)
    });
    if (!res.ok) {
        const message = `An Error has Occured ${res.status}`;
        throw new Error(message);
    }
    let data = await res.json();
    return data;
}

export async function DeleteFolder(folder: object) {
    const res = await fetch('https://rememberwhenagain.azurewebsites.net/Folder/DeleteFolder', {
        method: "POST",
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify(folder)
    });
    if (!res.ok) {
        const message = `An Error has Occured ${res.status}`;
        throw new Error(message);
    }
    let data = await res.json();
    return data;
}
export async function DeleteMemory(memory: object) {
    const res = await fetch('https://rememberwhenagain.azurewebsites.net/Memory/DeleteMemoryItem', {
        method: "POST",
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify(memory)
    });
    if (!res.ok) {
        const message = `An Error has Occured ${res.status}`;
        throw new Error(message);
    }
    let data = await res.json();
    return data;
}