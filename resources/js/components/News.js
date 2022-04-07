import React from 'react';
import M from 'materialize-css';
import Moment from 'react-moment';
import { InfiniteScroll } from 'react-simple-infinite-scroll'

export default class Home extends React.Component {
    constructor(props) {
        let today = new Date().getFullYear();
        super(props);
        //Initialize the state in the constructor
        this.state = {
            articles: [],
            categories: [],
            src: "",
            ArrayOfReadArt: [],
            isLoading: true,
            page: 0,
            currentDate: today
        }
        this.readArticle = this.readArticle.bind(this);
    }

    /*componentDidMount() is a lifecycle method
    * that gets called after the component is rendered
    */
    componentDidMount() {
        this.loadMore();
        
        fetch('/api/categories')
        .then(response => {
            return response.json();
        }).then(categories => {
            //Fetched articles is stored in the state
            this.setState({ categories });
        });

        //localStorage.clear();

        let storedData = localStorage.getItem("idOfArticlesRead");
        let ArrayOfReadArt = JSON.parse(storedData);
        this.setState({ ArrayOfReadArt });
        
        
    }
    
    loadMore = () => {
        let nxtPage = this.state.page + 1;
        this.setState({ isLoading: true, error: undefined })
        fetch('/api/articles?page='+nxtPage)
        .then(res => res.json())
        .then(articles => {
            $('#articleLoadErr').addClass('hide')
                this.setState(state => ({
                    articles: [...state.articles, ...articles.data],
                    page: articles.meta.current_page,
                    isLoading: false
                }))
        },error => {
            this.setState({ isLoading: false, error });
            $('#articleLoadErr').removeClass('hide');
            
        });
    }

    readArticle = (id, href, viewed, e) => {
        e.preventDefault();
        
        this.setState({ src: "" });
        this.setState({ src: href });
        $('.mainSect .progress').removeClass('hide');
        let st = this.state;
        let t = this;

        var win = window.open(href, '_blank');
        if (win) {
            //Browser has allowed it to be opened
            //update localstorage
            let ArrayData = [];
            let NuArrayData = [];
            let ArrayOfReadArt = [];
            if (typeof(Storage) !== "undefined") {
                // Code for localStorage
                let storedData = localStorage.getItem("idOfArticlesRead");
                ArrayData = JSON.parse(storedData);
                
                ArrayOfReadArt = st.ArrayOfReadArt;

                if(ArrayOfReadArt == null){
                    NuArrayData[0] = id;
                    localStorage.setItem("idOfArticlesRead",  JSON.stringify(NuArrayData));
                    ArrayOfReadArt = NuArrayData;
                    t.setState({ ArrayOfReadArt }); 
                } else {
                    if(!ArrayOfReadArt.includes(id)){
                        ArrayData.push(id);
                        localStorage.setItem("idOfArticlesRead",  JSON.stringify(ArrayData));
                        ArrayOfReadArt = ArrayData;
                        t.setState({ ArrayOfReadArt });
                    } else {
                        //console.log('id already')
                    }
                }     

            } else {
                // No web storage Support.
                M.toast();
            }
            //TODO: update articles.viewed
                        
            fetch('/api/articles/'+id, {
                method: 'PUT',
                body: JSON.stringify({
                    viewed: parseInt(viewed) + 1
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }          
            })
            .then(response => {
                return response.json();
            }).then(articles => {
                //Fetched articles is stored in the state
                //this.setState({ articles });
                
                if(this.state.articles.data){
                    this.setState(state => {
                        const art = state.articles.data.map((item, j) => {
                            if (item.id === id) {                            
                                return item.viewed = parseInt(item.viewed) + 1;
                            } else {
                                return item;
                            }
                            
                        });
                        
                        return {
                            art,
                        };
                    });
                } else {
                    this.setState(state => {
                        const art = state.articles.map((item, j) => {
                            if (item.id === id) {                            
                                return item.viewed = parseInt(item.viewed) + 1;
                            } else {
                                return item;
                            }
                            
                        });
                        
                        return {
                            art,
                        };
                    });
                }
                
            });

            //focus on the new tab
            win.focus();
        } else {
            //Browser has blocked it
            alert('Please allow popups for this website');
        }
        
    }

    renderArticles = () => {
        if(this.state.articles.data){
            return this.state.articles.data.map(article => { 
                let date = new Date(article.created_at)               
                let ArrayOfReadArt = this.state.ArrayOfReadArt;
                if(ArrayOfReadArt == null){
                    return (
                        /* When using list you need to specify a key
                        * attribute that is unique for each list item
                        */                  
                    
                        <tr key={article.id} >
                            <td className="yelo"><i className="material-icons">label</i></td>                            
                            <td><p><a href='#' onClick={(e) => this.readArticle(article.id, article.url, article.viewed, e)}>{ article.title }</a></p> <small><Moment fromNow>{ date }</Moment></small></td>
                            <td className="centre">{ article.viewed } </td>
                            <td className="centre">{ article.categories.category } </td>
                        </tr>      
                    );
                } else {
                    return (
                        /* When using list you need to specify a key
                        * attribute that is unique for each list item
                        */                  
                    
                        <tr key={article.id} >
                            {ArrayOfReadArt.includes(article.id) ? <td className="yelo"><i className="material-icons">label_outline</i></td> : <td className="yelo"><i className="material-icons">label</i></td>}
                            
                            <td><p><a href='#' onClick={(e) => this.readArticle(article.id, article.url, article.viewed, e)}>{ article.title }</a></p> <small><Moment fromNow>{ article.created_at }</Moment></small></td>
                            <td className="centre">{ article.viewed } </td>
                            <td className="centre">{ article.categories.category } </td>
                        </tr>      
                    );
                }
            })
        } else if(this.state.articles) {
            return this.state.articles.map(article => {
                let date = new Date(article.created_at)
                let ArrayOfReadArt = this.state.ArrayOfReadArt;
                if(ArrayOfReadArt == null){
                    return (
                        /* When using list you need to specify a key
                        * attribute that is unique for each list item
                        */                  
                    
                        <tr key={article.id} >
                            <td className="yelo"><i className="material-icons">label</i></td>                            
                            <td><p><a href='#' onClick={(e) => this.readArticle(article.id, article.url, article.viewed, e)}>{ article.title }</a></p> <small><Moment fromNow>{ date }</Moment></small></td>
                            <td className="centre">{ article.viewed } </td>
                            <td className="centre">{ article.categories.category } </td>
                        </tr>      
                    );
                } else {
                    return (
                        /* When using list you need to specify a key
                        * attribute that is unique for each list item
                        */                  
                    
                        <tr key={article.id} >
                            {ArrayOfReadArt.includes(article.id) ? <td className="yelo"><i className="material-icons">label_outline</i></td> : <td className="yelo"><i className="material-icons">label</i></td>}
                            
                            <td><p><a href='#' onClick={(e) => this.readArticle(article.id, article.url, article.viewed, e)}>{ article.title }</a></p> <small><Moment fromNow>{ article.created_at }</Moment></small></td>
                            <td className="centre">{ article.viewed } </td>
                            <td className="centre">{ article.categories.category } </td>
                        </tr>      
                    );
                }
            })
        } else {
            console.log('none')
        }
    }

    getArticleByCategory = (id, e) => {
        e.preventDefault();
        $('#catLoader').removeClass('hide');

        if(id == 0){
            this.setState({ page: 0 });

            this.setState({ isLoading: true, error: undefined })
            fetch('/api/articles?page=1')
            .then(res => res.json())
            .then(articles => {
                this.setState(state => ({
                    //articles: [...state.articles, ...articles.data],
                    articles: articles.data,
                    page: articles.meta.current_page,
                    isLoading: false
                }));
                console.log(this.state.articles)
            },error => {
            this.setState({ isLoading: false, error })
            })
        } else {
            /* fetch API in action */
            fetch('/api/articles/byCat/'+id)
            .then(response => {
                return response.json();
            }).then(articles => {
                //Fetched articles is stored in the state
                this.setState({ articles });
            });
        }      
        $('#catLoader').addClass('hide');  
    }

    searchArticle = (e) => {
        e.preventDefault();

        $('#searchBar').removeClass('hide');
    }

    hideSearchBar = (e) => {
        e.preventDefault();
        
        $('#searchBar').addClass('hide');
        $('#searchBar input').val("");
    }

    renderCat(){
        if(this.state.categories.data){
            return this.state.categories.data.map(category => {
                return (
                    <div className="swiperSlide" key={category.id}><a href="#" onClick={(e) => this.getArticleByCategory(category.id, e)} >{category.category}</a></div>
                //    <li key={category.id}><a href="#" onClick={(e) => this.getArticleByCategory(category.id, e)} className="collection-item" >{category.category}</a>  </li>   
                );
            })
        }
    }

    render() {
        let ArrayOfReadArt = this.state.ArrayOfReadArt;
        return (
            <div>
                <div className="navbar-fixed">
                    <nav>
                        <div className="nav-wrapper">
                            <a href="/" className="brand-logo">g'OZieCHUKWU</a>
                            <a href="#" data-target="mobile-demo" className="sidenav-trigger"><i className="material-icons">menu</i></a>
                            <ul id="nav-mobile" className="right hide-on-med-and-down">                                
                                <li><a href="https://devwithgozie.com.ng#contactMe" target="_blank">Contact</a></li>  
                                {/* <li><a href="#" onClick={(e) => this.searchArticle(e)}><i className="material-icons">search</i></a></li> */}
                            </ul>
                        </div>
                    </nav>
                    <ul className="sidenav" id="mobile-demo">
                        <li><a href="https://devwithgozie.com.ng#contactMe" target="_blank">Contact</a></li>  
                    </ul>
                        {/* <ul id="slide-out" className="sidenav">
                            <li>
                                <a href="#" onClick={(e) => this.getArticleByCategory(0, e)} className="collection-item">All</a>     
                            </li>   
                            <div className="progress hide" id="catLoader">
                                <div className="indeterminate"></div>
                            </div> 
                            { this.renderCat() }
                    </ul> */}
                    
                </div>
                <nav className="hide" id="searchBar">
                    <div className="nav-wrapper">
                        <form>
                            <div className="input-field">
                                <input id="search" type="search" />
                                <label className="label-icon" htmlFor="search"><i className="material-icons">search</i></label>
                                <i className="material-icons" id="closeSearchBar" onClick={(e) => this.hideSearchBar(e)}>close</i>
                            </div>
                        </form>
                    </div>
                </nav>
                <div className="swiperWrapper">
                    <div className="swiperSlide">
                        <a href="#" onClick={(e) => this.getArticleByCategory(0, e)} className="collection-item">All</a>
                    </div>
                    { this.renderCat() }
                </div>
                <div className="content">
                    <div className="row" id="mainRw">                        
                        <div className="col s12 m12 l9 mainSect">  
                            
                            <div className="row">
                                <div className="col s1 m1 l1">

                                </div>                           
                                <div className="col s7 m7 l7">
                                    <b>Title</b>
                                </div>
                                <div className="col s1 m1 l1 centre">
                                    <i className="material-icons">visibility</i>
                                </div> 
                                <div className="col s3 m3 l3 centre">
                                    <b>Category</b>
                                </div>
                            </div>
                            <div className="row hide" id="articleLoadErr"><div className="col s12"><p className="centre"><small>Error loading article. Please reload page.</small></p></div></div>
                            <InfiniteScroll
                                throttle={64}
                                threshold={300}
                                isLoading={this.state.isLoading}
                                hasMore={!!this.state.page}
                                onLoadMore={this.loadMore}
                                >
                                {this.state.articles.length > 0 ? this.state.articles.map(article => (
                                    
                                        <div className="row" key={article.id}>
                                            <div className="col s1 m1 l1 yelo">
                                                {ArrayOfReadArt != null && ArrayOfReadArt.includes(article.id) ? <i className="material-icons">label_outline</i>: <i className="material-icons">label</i>}
                                                
                                            </div>                           
                                            <div className="col s7 m7 l7">
                                                <a href='#' onClick={(e) => this.readArticle(article.id, article.url, article.viewed, e)}>{ article.title } <i className="material-icons smlIcon">open_in_new</i></a><br/> <small><Moment fromNow>{ article.created_at }</Moment></small>
                                            </div>
                                            <div className="col s1 m1 l1 centre">
                                                { article.viewed }
                                            </div> 
                                            <div className="col s3 m3 l3 centre">
                                                { article.categories.category }
                                            </div> 
                                        </div>
                                    ))
                                    : null }
                            </InfiniteScroll>
                            {this.state.isLoading && (
                                <div className="progress">
                                    <div className="indeterminate"></div>
                                </div>
                            )}
                            
                        </div>
                        
                        <div className="col l3 profile hide-on-med-and-down"> 
                            <div className="profileInner">
                                <div className="section">
                                    <img className="responsive-img" src="./img/HireDev.png" width="500px" height="600px"></img>
                                </div>
                                
                                <div className="section centre" id="footNote">
                                    <small>chig'OZieCHUKWU &copy; 2019 - {this.state.currentDate}</small>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
                
            </div>
        );
    }
}