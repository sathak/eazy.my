import React, { Component } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { actionProductListCreators } from '../actions/listings-action';
import LoadingSpinner from './LoadingSpinner'



class Home extends Component {
    //Home Method
 componentDidMount() {
    window.scrollTo(0, 0);
  }
    componentWillMount() {
        this.setState({ loading: true }, () => {
            this.props.requestProductLists();
        });
    }

    render() {

        return (

            <div>
                <h3>Listings</h3>
                {this.props.loading ? <LoadingSpinner /> :
                    <div className="col-md-12">
                        {this.props.products.map((home, index) =>
                            <div className="col-md-2 col-sm-6 col-xs-6" key={index}>
                                <Link to={'/viewItem/' + home.id}>
                                    <div className="card" >
                                        <img className="card-img-top" src={require(`../image/${home.id}.png`)} alt="" />
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
                }

            </div>

        );
    }
}


export default connect(state => state.allProducts,
    dispatch => bindActionCreators(actionProductListCreators, dispatch))(Home);
