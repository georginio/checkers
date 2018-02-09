export default function users (state = null, action) {
    switch (action.type) {
        case 'POPULATE_USERS':
            return action.payload
        case 'ADD_ACTIVE_USER':
            return [...state, action.payload]
        case 'REMOVE_ACTIVE_USER':
            return state.filter(user => user.id !== action.payload)
        default:
            return state
    }
}
