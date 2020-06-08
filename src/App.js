import React from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom'
import './Loading'
import './App.css';
import Loading from './Loading';


function LangList(props) {
  return (
    <nav>
      <ul>
        {props.list.map((lang) =>
          <li
            className='App-link'
            onClick={() => props.onHandleSelectedLanguage(lang)}
            key={lang} > {lang}  </li>
        )}
      </ul>

    </nav>
  )
}


function Results(props) {
  return (
    <div>
      <ul className="grid">
        {props.items.map((e) =>
          <li className="item-grid" key={e.id} > <ul>
            <li> <a href={e.html_url}> {e.name} </a></li>
            <li> @{e.owner.login}  </li>
            <li> {e.stargazers_count}  </li>
          </ul></li>
        )}
      </ul>
    </div>
  )
}


class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      list: ['All', 'Paython', 'Javascript', 'Ruby'],
      activeLanguage: 'All',
      loading: false,
      results: []
    }
    this.fetchPopularRepos = this.fetchPopularRepos.bind(this)
    this.handleSelectedLanguage = this.handleSelectedLanguage.bind(this)
  }

  handleSelectedLanguage(lang) {
    this.setState({
      activeLanguage: lang
    })
  }

  fetchPopularRepos(language) {
    // "language" can be "javascript", "ruby", "python", or "all"
    const encodedURI = encodeURI(`https://api.github.com/search/repositories?q=stars:>1+language:${language}&sort=stars&order=desc&type=Repositories`)
    this.setState({
      loading: true
    })
    return fetch(encodedURI)
      .then((data) => data.json())
      .then((repos) => {
        console.log(repos.items)
        this.setState({
          results: repos.items,
          loading: false
        })
      })
      .catch((error) => {
        console.warn(error)
        return null
      });
  }

  componentDidMount() {
    this.fetchPopularRepos(this.state.activeLanguage)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.activeLanguage !== this.state.activeLanguage) {
      this.fetchPopularRepos(this.state.activeLanguage)
    }
  }

  render() {

    return (
      <div className="lang-container">
        <LangList list={this.state.list} onHandleSelectedLanguage={this.handleSelectedLanguage} />
        <div className="container">
          {this.state.loading === true
            ? <Loading />
            : <div>
              <h1 style={{ textAlign: 'center' }}> {this.state.activeLanguage}</h1>
              <Results items={this.state.results} />
            </div>
          }
        </div>
      </div>
    )

  }
}

export default App;
