export const setPlayOptions = options => ({
    type: 'SET_OPTIONS',
    payload: options
})

export const switchTurn = turn => ({
    type: 'SWITCH_TURN',
    payload: turn
})

export const resetOptions = () => ({
    type: 'RESET_OPTIONS'
})