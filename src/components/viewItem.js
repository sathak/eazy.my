import React, { Component } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { actionViewItemCreators } from '../actions/listings-action';
import './viewItem.css'
class viewItem extends Component {


    componentWillMount() {
        // This method runs when the component is first added to the page
        const id = this.props.match.params.id;

        this.props.requestViewItem(id);
    }



    render() {
        return (
            <div className="row viewItem">

                {this.props.Item.map((itm,i) =>
                    <div className="col-md-offset-1" key={i}>
                        <div className="Item-header">
                            <Link to="/">
                                <span>Home</span>
                            </Link>
                            <span> > </span><span>{itm.attributes.title}</span>
                        </div>
                        <div className="product-title">{itm.attributes.title}</div>
                    </div>
                )}
                <div className="cardItem">
                    <div className="row">
                        <div className="wrapper row">
                            <div className="col-md-1"></div>
                            <div className="preview col-md-7">

                                <div className="preview-pic tab-content">
                                    <div className="tab-pane active" id="pic-1">
                                        {this.props.Item.map((itm,i)  =>
                                            <img src={require(`../image/${itm.id}.png`)} key={i} alt="image" />
                                        )}
                                    </div>
                                </div>


                            </div>
                            <div className="details col-md-3">

                                <div className="col-md-12 ">
                                    <div className="col-md-6 col-xs-6">
                                        <span className="fa fa-heart Item-pricelabel1">Wishlist</span>
                                    </div>
                                    <div className="col-md-6 col-xs-6">
                                        <span className="fa fa-share-alt Item-pricelabel1">Share</span>
                                    </div>
                                </div>
                                <p className="Item-pricelabel">Price</p>
                                <div className="Item-pricetext">
                                    <p className="card-text">RM 1200</p>
                                </div>
                                <p className="Item-pricelabel">Item Condition</p>
                                {this.props.Item.map((itm,i)  =>
                                    <div className="Item-info" key={i}>
                                        <p className="card-text">{itm.attributes.condition}</p>
                                    </div>
                                )}
                                <p className="Item-pricelabel">Item Location</p>
                                {this.props.Item.map((itm,i)  =>
                                    <div className="Item-info" key={i}>
                                        <p className="card-text">{itm.attributes.location}</p>
                                    </div>
                                )}
                                <p className="Item-pricelabel">Seller Info</p>
                                <div className="Item-pricetext col-md-12">
                                    <div className="col-md-2 col-xs-2">
                                        <i className="fa fa-user-circle sellerIcon" aria-hidden="true"></i>
                                    </div>
                                    {this.props.Item.map((itm,i)  =>
                                        <div className="col-md-10 col-xs-10" key={i}>
                                            <p className="seller-info-text1">{itm.attributes.seller_name}</p>
                                            <p className="seller-info-text2">{itm.attributes.seller_type}</p>
                                        </div>
                                    )}
                                </div>
                                <div className="col-md-12 boderTop webInfo">
                                    <div className="row">
                                    Interested withe the ad? Contact the seller
                                    </div>
                                    {this.props.Item.map((itm,i)  =>
                                    <div className="row" key={i}>
                                    <a className="btn btn-outline-danger btnWidth"><i className="fa fa-phone"></i><span className="padLeft">{itm.attributes.phone}</span></a>
                                    </div>
                                    )}
                                    <div className="row">
                                    <a className="btn btn-outline-danger btnWidth"><i className="fa fa-envelope"></i><span className="padLeft">Email</span></a>
                                    </div>
                                    <div className="row">
                                    <a className="btn btn-danger btnWidth"><i className="fa fa-wechat"></i><span className="padLeft">Chat</span></a>
                                    </div>
</div>
                            </div>
                            <div className="col-md-1"></div>
                        </div>
                        <div className="wrapper row desc mInfo">
                            <div className="col-md-1"></div>
                            <div className="col-md-8">
                                <div className="tab" role="tabpanel">

                                    <ul className="nav nav-tabs" role="tablist">
                                        <li role="presentation" className="active">
                                            <a aria-controls="home" role="tab" data-toggle="tab">Description</a></li>

                                    </ul>

                                    <div className="tab-content tabs">
                                        <h3></h3>
                                        <div role="tabpanel" className="tab-pane fade in active" id="Section1">
                                            {this.props.Item.map((itm,i)  =>
                                                <p className="borderLine" key={i}>{itm.attributes.description}</p>
                                            )}
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="wrapper mInfo">
                            <div className="col-md-1"></div>
                            <div className="">
                                <div className="col-md-12"> Similar Products :</div>
                                <div className="col-md-2 col-sm-6 col-xs-6">

                                    <div className="card" >
                                        <img className="card-img-top" src={require(`../image/1.png`)} alt="Card image cap" />
                                        <div className="card-body">
                                            <p className="card-title">Nintendo Switch Neon Joy-Con (1 Year MaxSoft Warranty) + Screen Protector</p>

                                        </div>
                                        <div className="card-footer">
                                            <p className="card-text">RM 2800</p>
                                        </div>
                                    </div>

                                </div>

                                <div className="col-md-2 col-sm-6 col-xs-6">
                                    <div className="card" >
                                        <img className="card-img-top" src={require(`../image/2.png`)} alt="Card image cap" />
                                        <div className="card-body">
                                            <p className="card-title">Nintendo Switch grey Joy-Con</p>

                                        </div>
                                        <div className="card-footer">
                                            <p className="card-text">RM 1200</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-2 col-sm-6 col-xs-6">
                                    <div className="card" >
                                        <img className="card-img-top" src={require(`../image/3.png`)} alt="Card image cap" />
                                        <div className="card-body">
                                            <p className="card-title">Nintendo Switch grey fullset warranty</p>

                                        </div>
                                        <div className="card-footer">
                                            <p className="card-text">RM 1680</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-2 col-sm-6 col-xs-6">
                                    <div className="card" >
                                        <img className="card-img-top" src={require(`../image/4.png`)} alt="Card image cap" />
                                        <div className="card-body">
                                            <p className="card-title">Nintendo Switch grey fullset warranty</p>

                                        </div>
                                        <div className="card-footer">
                                            <p className="card-text">RM 1280</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-2 col-sm-6 col-xs-6">
                                    <div className="card" >
                                        <img className="card-img-top" src={require(`../image/5.png`)} alt="Card image cap" />
                                        <div className="card-body">
                                            <p className="card-title">Nintendo Switch grey fullset warranty</p>

                                        </div>
                                        <div className="card-footer">
                                            <p className="card-text">RM 1200</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-2 col-sm-6 col-xs-6">
                                    <div className="card" >
                                        <img className="card-img-top" src={require(`../image/6.png`)} alt="Card image cap" />
                                        <div className="card-body">
                                            <p className="card-title">Nintendo Switch grey Joy-Con</p>

                                        </div>
                                        <div className="card-footer">
                                            <p className="card-text">RM 1080</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-12 boderTop mobInfo">
                                   
                                    {this.props.Item.map((itm,i)  =>
                                    <div className="col-xs-4" key={i}>
                                    <a className="btn btn-outline-danger btn-sm btnWidth"><i className="fa fa-phone"></i><span className="padLeft">{itm.attributes.phone}</span></a>
                                    </div>
                                    )}
                                    <div className="col-xs-4">
                                    <a className="btn btn-outline-danger btn-sm btnWidth"><i className="fa fa-envelope"></i><span className="padLeft">Email</span></a>
                                    </div>
                                    <div className="col-xs-4">
                                    <a className="btn btn-danger btn-sm btnWidth"><i className="fa fa-wechat"></i><span className="padLeft">Chat</span></a>
                                    </div>
</div>
            </div>
        )
    }
}
export default connect(state => state.allProducts,
    dispatch => bindActionCreators(actionViewItemCreators, dispatch)
)(viewItem);
