export default function messageReducer (state = [], action) {
    switch (action.type) {
        case 'ADD_MESSAGE':
            return [...state, action.payload]
        default:
            return state
    }
}