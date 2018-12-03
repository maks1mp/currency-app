import {CHANGE_CURRENCY, SHOW_LOADER, HIDE_LOADER, FINISH_UPLOAD_DATA} from '../actions';
import initialState from './initial';

const actionHandlers = {
    [CHANGE_CURRENCY]: (state, {currency}) => ({...state, currency}),
    [CHANGE_CURRENCY + SHOW_LOADER]: (state, {currency}) => ({...state, currency, loading: true}),
    [CHANGE_CURRENCY + HIDE_LOADER]: (state, {currency}) => ({...state, currency, loading: false}),
    [FINISH_UPLOAD_DATA + HIDE_LOADER]: (state, {exchangeData}) => ({...state, exchangeData, loading: false})
};

function mainReducer(state = initialState, action) {
    const handler = actionHandlers[action.type];

    return handler ? handler(state, action) : state;
}

export default mainReducer;
