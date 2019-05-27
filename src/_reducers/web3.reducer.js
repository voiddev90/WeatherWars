import { web3Constants } from '../_constants';

const initialState = {
    Web3: ""
};

export function web3Reducer(state = initialState, action) {
    switch (action.type) {
        case web3Constants.SET_WEB3:
            state = {
                Web3: action.payload
            };
            break;
        default:
            break;
        }
    return state;
}