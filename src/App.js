import React, {Component} from 'react';
import './App.css';
import axios from 'axios';

class App extends Component{
  state = {
    curTime : undefined,
    todos : [],
    quote : {},
    landscape : {}
  }
  componentWillMount() {

    axios.get('landscapes/credits.json').then(response => {
      let landscapes = response.data;
      console.log("TCL: App -> componentWillMount -> landscapes", landscapes)
      let landscapeslength = landscapes.length;
      console.log("TCL: App -> componentWillMount -> landscapeslength", landscapeslength)
      this.setState({ landscape: landscapes[Math.floor(Math.random() * (+landscapeslength - +0)) + +0] })

    });

    axios.get('quotes.json').then(response => {
      let quotes = response.data;
      let quotesLength = quotes.length;
      this.setState({ quote: quotes[Math.floor(Math.random() * (+quotesLength - +0)) + +0] })

    });

    setInterval(() => {
      let curDateTime = new Date().toLocaleString();
      this.setState({
        curTime : curDateTime.split(',').pop(),
      })
    }, 1000);
  };

  render() {
    const curTime = this.state.curTime;
    const quote = this.state.quote;
    const landscape = this.state.landscape;
    document.body.background = landscape.photo_url;

    return (

      <div className="App" >
        <h1>Hello world!</h1>
        <h1>
          { curTime }
      </h1>
        <footer>
          <div>{landscape.user_name}</div>
          <div><i>"{quote.quoteText}"</i></div>
          <div>{quote.quoteAuthor}</div>
        </footer>
      </div>
    );
  }
};

export default App;
