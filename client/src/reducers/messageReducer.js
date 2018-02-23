export default function messageReducer (state = [], action) {
    switch (action.type) {
        case 'ADD_MESSAGE':
            return [...state, action.payload]
        case 'REMOVE_MESSAGES':
            return []
        default:
            return state
    }
}