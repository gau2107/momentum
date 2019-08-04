import React, {Component} from 'react';
// import './App.css';
import 'antd/dist/antd.css';
import './index.css';
import './App.css';
import '../node_modules/material-icons/css/material-icons.css'
import ls from 'local-storage'
import { Input, Icon, Button, Row, Col } from 'antd';
import axios from 'axios';

class App extends Component{


  constructor(props){
    super(props);
    this.login = this.login.bind(this);
    this.state = {
      curTime: undefined,
      todos: [],
      quote: {},
      landscape: {},
      auth: false,
      userName : undefined,
      greeting: undefined,
      focus: undefined
    };
    this.handleChange = this.handleChange.bind(this);
    this.addFocusOnEnterKey = this.addFocusOnEnterKey.bind(this);
    this.login = this.login.bind(this);
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  /**
   * login code goes here
   */
  login() {
    localStorage.setItem('userName', this.state.userName);
  }

  /**
   * Get Greeting text Good(Morning/Evening) etc...
   */
  getGreetingText(){
    let hrs = new Date().getHours();
    let greeting = undefined;
    if(hrs <= 11){
      greeting = "Good Morning";
    }
    else if (hrs === 12) {
      greeting = "Good Noon";
    }
    else if (hrs >= 13 && hrs <= 16) {
      greeting = "Good Afternoon";
    }
    else{
      greeting = "Good Evening"
    }
    this.setState({ greeting: greeting});
  }

  /**
   * Check authetication
   */
  checkAuth(){
    if (ls.get('userName')) {
      this.setState({ auth: true });
      this.setState({ userName: ls.get('userName') });
    }

    else {
      this.setState({ auth: false });
    }
  }

  checkFocus(){
    if (ls.get('focus')) {
      this.setState({ focus: ls.get('focus') });
    }
  }

  /**
   * Get background image with its PC
   */
  getLandscapes(){
    axios.get('landscapes/credits.json').then(response => {
      let landscapes = response.data;
      let landscapeslength = landscapes.length;

      this.setState({ landscape: landscapes[Math.floor(Math.random() * (+landscapeslength - +0)) + +0] })

    });
  }

  /**
   * Get Quote with its Author
   */
  getQuotes(){
    axios.get('quotes.json').then(response => {
      let quotes = response.data;
      let quotesLength = quotes.length;
      this.setState({ quote: quotes[Math.floor(Math.random() * (+quotesLength - +0)) + +0] })

    });

  }

  componentWillMount() {

    this.getGreetingText();

    this.checkAuth();

    this.getLandscapes();

    this.getQuotes();

    this.checkFocus();

    setInterval(() => {
      let curDateTime = new Date().toLocaleString();
      this.setState({
        curTime : curDateTime.split(',').pop(),
      })
    }, 1000);

  };

  addFocusOnEnterKey(event){

    if (event.keyCode === 13) {
      localStorage.setItem('focus', this.state.focus);
    }
  }

  render() {

    const userName = this.state.userName;
    const curTime = this.state.curTime;
    const quote = this.state.quote;
    const landscape = this.state.landscape;
    const greeting = this.state.greeting;
    const focus = this.state.focus;
    document.body.background = landscape.photo_url;

    return (

      <div className="App" >
        <h1>{greeting} {userName}!</h1>
        <h1>
          { curTime }
      </h1>
      {/* <middle > */}
        <div>
          <Row>
            <Col span={8}></Col>
            <Col span={7}>
            <Input
              name="userName"
              value = {this.state.userName}
              onChange={this.handleChange}
              placeholder="What's your name?"
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
            />
            </Col>
            <Col span={1}>
              <Button type="primary" onClick={this.login}>Done</Button>
            </Col>
            <Col span={8}></Col>
          </Row>
        </div>
        {/* </middle> */}
        <footer>
          <div>{landscape.user_name}
          </div>
          <i className="material-icons">sync</i>

          <div><i>"{quote.quoteText}"</i></div>
          <div>{quote.quoteAuthor}</div>
        </footer>
        <br></br>
        <br></br>
        <Row>
          <Col span={7}></Col>
          <Col span={10}>
            <Input
              addonAfter={<Icon type="enter" />}
              size="large"
              name="focus"
              value={this.state.focus}
              onKeyDown={this.addFocusOnEnterKey}
              onChange={this.handleChange}
              placeholder="What's your main focus for today?"
            />
          </Col>
          <Col></Col>

        </Row>
        <label>{ focus }</label>
      </div>
    );
  }
};

export default App;
