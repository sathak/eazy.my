export const requestProductListsType = 'REQUEST_PRODUCT_LIST';
export const receiveProductListsType = 'RECEIVE_PRODUCT_LIST';
export const receiveViewItemType = 'RECEIVE_VIEW_ITEM';

export const actionProductListCreators = {
    requestProductLists: () => async (dispatch, getState) => {
        // if (startDateIndex === getState().weatherForecasts.startDateIndex) {
            
        //     return;
        // }

        dispatch({ type: requestProductListsType });

        const url = `https://5b35ede16005b00014c5dc86.mockapi.io/list`;
        const response = await fetch(url);
        const _forecasts = await response.json();
        const products =_forecasts.data;
        dispatch({ type: receiveProductListsType,  products ,loading:false});
    }

   
};

export const actionViewItemCreators = {
requestViewItem:id=>async (dispatch, getState) => {
    if (id === getState().allProducts.id) {
        
        return;
    }
    dispatch({ type: requestProductListsType });

    const url = `https://5b35ede16005b00014c5dc86.mockapi.io/view/`+id;
    const response = await fetch(url);
    const _forecasts = await response.json();
    const Item =[];
    Item.push(_forecasts.data) ;
    console.log(Item);
    dispatch({ type: receiveViewItemType,  Item ,loading:false});
}
};
