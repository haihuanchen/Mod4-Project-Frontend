import React from 'react';
import './App.css';
import MainContainer from './Containers/MainContainer';
import CreateAccount from './Components/CreateAccount';
import NavBar from './Components/NavBar';
import PostForm from './Components/PostForm'
import { Route, Switch } from 'react-router-dom';

const LANGUAGESAPI  = "http://localhost:3000/languages"
const POSTAPI = "http://localhost:3000/posts"
const UserAPI = 'http://localhost:3000/users'

export default class App extends React.Component{
  state = {
    userIndex: [],
    languageIndex: [],
    postIndex: [],
    targetedposts: [],
    targetedLanguage: null, //language id
    search: '',
    currentUser: {
      id: 29,
      name: "SamTheMan",
      username: "quinn",
      email: "samchen@123.com",
      password: "123"
    }
  }

  componentDidMount(){
    fetch(UserAPI)
    .then(res=>res.json())
    .then(data=> this.setState({userIndex: data}))

    fetch(LANGUAGESAPI)
        .then(resp => resp.json())
        .then(data => this.setState({languageIndex: data}))

    fetch(POSTAPI)
    .then(resp => resp.json())
    .then(data => this.setState({postIndex: data}))
  }

  filterPosts = (languageId)=>{
    let newPosts = this.state.postIndex.filter(post => post['language_id'] === languageId)
    this.setState({targetedposts: newPosts})
  }

  createUser = (newUser)=>{
    this.setState({userIndex: [...this.state.userIndex, newUser], currentUser: newUser})
  }

  handleLangChange = (event) => {
    this.setState({targetedLanguage: event.target.value, targetedposts: []})
  }

  handleSearchChange = (e) => {
    this.setState({search: e.target.value})
  }

  createPost = (newPost) => {
    this.setState({postIndex: [...this.state.postIndex, newPost]})
  }

  deletePost = (postId) => {
    let remainPosts = this.state.postIndex.filter(post => post.id !== postId)
    let remainTarget = this.state.targetedposts.filter(post => post.id !== postId)
    this.setState({postIndex: remainPosts, targetedposts: remainTarget})
  }

  render(){
    const {languageIndex, targetedposts, targetedLanguage, search, currentUser} = this.state
    let searchArticles = targetedposts.filter(post=> post.title.toLowerCase().includes(search.toLowerCase()))
    // console.log(this.state.currentUser)
    return (
      <div className="App">
        <header className="App-header">
      <h1> Welcome to Source Code {this.state.currentUser.name}</h1>
          <NavBar search={search} handleSearchChange={this.handleSearchChange} currentUser={currentUser}/>
          <Switch>
            <Route exact path="/home" render={()=> 
              <MainContainer 
                filterPosts={this.filterPosts} 
                languages={languageIndex} 
                posts={targetedposts ? targetedposts : null} 
                searchArticles={searchArticles}
                handleLangChange={this.handleLangChange}
                targetedLanguage={targetedLanguage}
                deletePost={this.deletePost}
              />} 
            />
            <Route path='/signup' render={()=> <CreateAccount createUser={this.createUser} {...this.props} />} />
            <Route path='/postform'  render={currentUser && targetedLanguage ? ()=> <PostForm createPost={this.createPost} userId={currentUser.id} langId={targetedLanguage}/> : null} />
          </Switch>
        </header>
      </div>
    )

  }
}
