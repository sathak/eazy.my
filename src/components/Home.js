import React, { Component } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { actionProductListCreators } from '../actions/listings-action';




class Home extends Component {

   
    componentWillMount() {
       
        this.props.requestProductLists();
    }

    render() {
        
        return (

            <div>
                <h3>Listings</h3>
                <div className="col-md-12">
                {this.props.products.map(home =>
                        <div className="col-md-2 col-sm-6 col-xs-6">
                            <Link to={'/viewItem/'+home.id}>
                                <div className="card" >
                                    <img className="card-img-top"  src={require(`../image/${home.id}.png`)} alt="Card image cap" />
                                    <div className="card-body">
                                        <p className="card-title">{home.attributes.title}</p>
                                        
                                    </div>
                                  <div className="card-footer">
                                  <p className="card-text">{home.attributes.price}</p>
                                  </div>
                                </div>
                            </Link>
                        </div>
                    )}
                    </div>

                
            </div>

        );
    }
}


export default connect(state => state.allProducts,
    dispatch => bindActionCreators(actionProductListCreators, dispatch))(Home);
