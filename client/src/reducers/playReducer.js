const initialState = {
    side: '',
    turn: '',
    opponent: {
        usernanme: '',
        id: ''
    },
    roomName: ''
}

export default function sideReducer (state = initialState, action) {
    switch (action.type) {
        case 'SET_OPTIONS': 
            return Object.assign({}, state, {...action.payload})
        case 'SWITCH_TURN':
            return Object.assign({}, state, { turn: action.payload })    
        default:
            return state
    }
}
