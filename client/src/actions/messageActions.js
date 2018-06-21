export const saveMessage = message => ({
    type: 'ADD_MESSAGE',
    payload: message
})

export const cleanHistory = () => ({
    type: 'REMOVE_MESSAGES'
})

export const addToLastMessage = message => ({
    type: 'ADD_TO_LAST',
    payload: message
})
