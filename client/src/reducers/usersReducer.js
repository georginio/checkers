export default function users (state = null, action) {
    switch (action.type) {
        case 'POPULATE_USERS':
            return action.payload
        default:
            return state
    }
}
