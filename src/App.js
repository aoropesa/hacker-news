import React, { Component } from 'react';
import './App.css';

const DEFAULT_QUERY = 'redux';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';

class Button extends Component{
  render(){
    const {onClick, className='', children} = this.props;
    return (
      <button onClick={onClick} className={className} type="button">
        {children}
      </button>
    );
  }
}

function Search(props){
    const {value, onChange,children} = props;
    return (
      <form>
        {children}<input type="text" onChange={onChange} value={value}/>
      </form>
    );
  }

  const largeColumn = {
    width: "40%"
  }

function Table ({list, pattern, onDismiss}){
    return (
      <div className='table'>
        {list.filter(isSearched(pattern)).map(item => (
            <div key={item.objectID} className='table-row'>
              <span style={largeColumn}><a href={item.url}>{item.title}</a></span>
              <span style={{width: '30%'}}>{item.author}</span>
              <span style={{width: '10%'}}>{item.num_comments}</span>
              <span style={{width: '10%'}}>{item.points}</span>
              <span style={{width: '10%'}}>
                <Button onClick={()=> onDismiss(item.objectID)} className="button-inline">
                  Dismiss
                </Button>
              </span>
            </div>
        ))}
      </div>
    );
  }

const isSearched = searchTerm => item => item.title.toLowerCase().includes(searchTerm.toLowerCase());

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      result: null,
      searchTerm: DEFAULT_QUERY
    };
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }
  setSearchTopStories(result){
    this.setState({result});
  }
  fetchSearchTopStories(searchTerm){
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(e => e);
  }
  componentDidMount(){
    const {searchTerm} = this.state;
    this.fetchSearchTopStories(searchTerm);
  }

  onSearchChange(event){
    this.setState({searchTerm: event.target.value});
  }
  onDismiss(id){
    const updatedHits = this.state.result.hits.filter(function (item){
      return item.objectID !== id;
    });
    this.setState({
      result: Object.assign({}, this.state.reult, {hits: updatedHits})
    });
  }
  render() {
    const {searchTerm, result} = this.state;
    if(!result){return null}
    return (
      <div className="page">
        <div className="interactions">
        <Search  value={searchTerm} onChange={this.onSearchChange}>
          Search </Search>
          </div>
        <Table list={result.hits} pattern={searchTerm} onDismiss={this.onDismiss}/>
      </div>
    );
  }
}

export default App;
