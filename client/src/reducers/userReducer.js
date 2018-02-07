export default function userReducer (state = {}, action) {
 
    switch (action.type) {
        case 'SAVE_USERNAME': 
            return action.payload
        default: 
            return state
    }
}