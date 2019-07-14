import React, {Component} from 'react';
import './App.css';
import axios from 'axios';

class App extends Component{
  state = {
    curTime : undefined,
    todos : [],
    quote : {},
  }
  componentWillMount() {

    axios.get('https://jsonplaceholder.typicode.com/todos?_limit=10')
      .then(res => this.setState({ todos: res.data }));

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
    const todos = this.state.todos
    const quote = this.state.quote;

    return (

      <div className="App" >
        <h1>Hello world!</h1>
        <h1>
          { curTime }
      </h1>
        <footer>
          <div><i>"{quote.quoteText}"</i></div>
          <div>{quote.quoteAuthor}</div>
        </footer>
      </div>
    );
  }
};

export default App;
