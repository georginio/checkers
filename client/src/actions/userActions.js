import axios from 'axios'

export const fetchActiveUsers = () => dispatch =>
    axios   
        .get('http://localhost:3300/api/users/all')
        .then(({data}) => {
            debugger;
            dispatch(saveActiveUsers(data.users))
        })
        .catch(err => console.log(err))
    
export const addActiveUser = user => ({
    type: 'ADD_ACTIVE_USER',
    payload: user
})

export const saveUsername = username => ({
    type: 'SAVE_USERNAME',
    payload: { username }
})

export const saveActiveUsers = users => ({
    type: 'POPULATE_USERS',
    payload: users
})

export const userLogout = id => ({
    type: 'REMOVE_ACTIVE_USER',
    payload: id
})
