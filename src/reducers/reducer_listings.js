import { requestProductListsType, receiveProductListsType,receiveViewItemType } from '../actions/listings-action';

const initialState = { products: [],Item:[], loading: true };

export const reducer = (state, action) => {
    state = state || initialState;

    if (action.type === requestProductListsType) {
        return {
            ...state,
            loading: true
        };
    }

    if (action.type === receiveProductListsType) {
        return {
            ...state,
            products: action.products,
            loading: action.loading
        };
    }

    if (action.type === receiveViewItemType) {
        return {
            ...state,
            Item: action.Item,
            loading: action.loading
        };
    }

    return state;
};
