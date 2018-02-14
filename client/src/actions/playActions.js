export const setPlayOptions = options => ({
    type: 'SET_OPTIONS',
    payload: options
})

export const switchTurn = turn => ({
    type: 'SWITCH_TURN',
    payload: turn
})
