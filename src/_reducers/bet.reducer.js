import { betConstants } from '../_constants';

const initialState = {
    name: ""
};

export function betReducer(state = initialState, action) {
    switch (action.type) {
        case betConstants.SetBet:
        console.log("REDUCER!");
            state = {
                name: action.payload
            };
            break;
        default:
            break;
        }
    return state;
}