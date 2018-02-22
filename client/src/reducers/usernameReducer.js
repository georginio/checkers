export default function usernameReducer (state = '', action) {
    switch (action.type) {
        case 'SAVE_USERNAME': 
            return action.payload
        case 'LOG_OUT':
            return ''
        default: 
            return state
    }
}