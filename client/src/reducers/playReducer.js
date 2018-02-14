const initialState = {
    side: '',
    turn: ''
}

export default function sideReducer (state = initialState, action) {
    switch (action.type) {
        case 'SET_OPTIONS': 
            return action.payload
        case 'SWITCH_TURN':
            return Object.assign({}, state, { turn: action.payload })    
        default:
            return state
    }
}
