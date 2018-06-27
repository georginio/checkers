export const addActiveUser = user => ({
    type: 'ADD_ACTIVE_USER',
    payload: user
})

export const saveUsername = username => ({
    type: 'SAVE_USERNAME',
    payload: username
})

export const saveActiveUsers = users => ({
    type: 'POPULATE_USERS',
    payload: users
})

export const removeUser = id => ({
    type: 'REMOVE_ACTIVE_USER',
    payload: id
})

export const removeBusyUsers = userIds => ({
    type: 'REMOVE_BUSY_USERS',
    payload: userIds
})

export const logout = () => ({ type: "LOG_OUT" })
