export default function messageReducer (state = [], action) {
    switch (action.type) {
        case 'ADD_MESSAGE':
            return [...state, action.payload]
        case 'REMOVE_MESSAGES':
            return []
        case 'ADD_TO_LAST': {
            let last = state.pop();
            last.text = last.text + `\n${action.payload.text}`;
            return [...state, last];
        } 
        default:
            return state
    }
}