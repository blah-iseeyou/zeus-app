import React from 'react'

let User = React.createContext(null);
let SetUser = React.createContext(() => {});

export {
    User,
    SetUser
}

export default User;
