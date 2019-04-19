import { combineReducers } from 'redux';
import ListingReducer from './reducer_listings'

const rootReducer = combineReducers({
    listings: ListingReducer
})

export default rootReducer