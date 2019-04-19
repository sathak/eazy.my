import { requestProductListsType, receiveProductListsType,receiveViewItemType } from '../actions/listings-action';

const initialState = { products: [],Item:[], isLoading: false };

export const reducer = (state, action) => {
    state = state || initialState;

    if (action.type === requestProductListsType) {
        return {
            ...state,
            isLoading: true
        };
    }

    if (action.type === receiveProductListsType) {
        return {
            ...state,
            products: action.products,
            isLoading: false
        };
    }

    if (action.type === receiveViewItemType) {
        return {
            ...state,
            Item: action.Item,
            isLoading: false
        };
    }

    return state;
};
