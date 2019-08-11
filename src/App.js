import React, {Component} from 'react';
// import './App.css';
import 'antd/dist/antd.css';
import './index.css';
import './App.css';
import '../node_modules/material-icons/css/material-icons.css'
import ls from 'local-storage'
import ReactAnimatedWeather from 'react-animated-weather';
import { Input, Icon, Button, Row, Col, Card, Checkbox } from 'antd';
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
      focus: undefined,
      todo: undefined
    };
    this.handleChange = this.handleChange.bind(this);
    this.addFocusOnEnterKey = this.addFocusOnEnterKey.bind(this);
    this.login = this.login.bind(this);
    this.addTodo = this.addTodo.bind(this);
    this.delTodo = this.delTodo.bind(this);
    this.markComplete = this.markComplete.bind(this);
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  /**
   * login code goes here
   */
  login() {
    localStorage.setItem('userName', this.state.userName);
    this.setState({ auth: true});
  }

  getTodos(){
    let todos = localStorage.getItem('todos');
    if(todos && todos.length){
      this.setState({todos: JSON.parse(todos)});
    }
  }

  delTodo(index){
    this.state.todos.splice(index, 1);
    localStorage.setItem('todos', JSON.stringify(this.state.todos));
  }

  markComplete(index) {
    this.state.todos[index].completed = !this.state.todos[index].completed;
    localStorage.setItem('todos', JSON.stringify(this.state.todos));

  }

  /**
   * Add todo
   */
  addTodo(){
    this.state.todos.push({title : this.state.todo, completed : false});
    localStorage.setItem('todos', JSON.stringify(this.state.todos));
    this.getTodos();
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

    this.getTodos();

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

    const defaults = {
      icon: 'PARTLY_CLOUDY_DAY',
      color: 'white',
      size: 100,
      animate: true
    };

    const auth = this.state.auth;
    const userName = this.state.userName;
    const curTime = this.state.curTime;
    const quote = this.state.quote;
    const landscape = this.state.landscape;
    const greeting = this.state.greeting;
    const focus = this.state.focus;
    const todos = this.state.todos;
    document.body.background = landscape.photo_url;

    return (

      <div className="App"><br></br>
        <div>
          <ReactAnimatedWeather
            icon={defaults.icon}
            color={defaults.color}
            size={defaults.size}
            animate={defaults.animate}
          />
        </div>
        <h1 style={{color: 'white', fontSize: '50px', fontFamily: 'serif', textShadow: '0 1px 5px rgba(0,0,0,.1)'}}>{greeting} {userName}!</h1>
        <h1 style={{ color: 'white', fontSize: '70px', fontFamily: 'monospace', textShadow: '0 1px 5px rgba(0,0,0,.1)'}}>
          { curTime }
      </h1>
      {/* <middle > */}
        <div>
          {!auth ? (
            <Row>
              <Col span={8}></Col>
              <Col span={7}>
                <Input
                  style={{
                    borderWidth: '3px', borderTopStyle: 'none', borderLeftStyle: 'none',borderRightStyle: 'none',
                    color: 'white', borderBottomColor: 'white', background: 'transparent', fontWeight: 'bold', fontSize: '32px'
                    , textShadow: '0 1px 5px rgba(0,0,0,.1)'
                  }}
                  name="userName"
                  value={this.state.userName}
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
          ):(
            <Row></Row>
          )}

        </div>
        {/* </middle> */}
        <footer style={{ color: 'white', fontSize: 'x-large', textShadow: '0 1px 5px rgba(0,0,0,.1)'}}>
          <div >{landscape.user_name}
          </div>

          <div><i>"{quote.quoteText}"</i></div>
          <div>{quote.quoteAuthor}</div>
        </footer>
        <br></br>
        <br></br>
        <Row>
          <Col span={7}></Col>
          <Col span={10}>
            <Input
              style={{
                borderWidth: '3px', borderTopStyle: 'none', borderLeftStyle: 'none', borderRightStyle: 'none',
                color: 'white', borderBottomColor: 'white', background: 'transparent', fontSize: '32px', textShadow: '0 1px 5px rgba(0,0,0,.1)'
              }}
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

        {/* Todos */}
        <div>
          <div style={{ background: 'transparent', padding: '30px', color: 'white'}}>
            <Card title={<span style={{color: "white"}}>Title</span>} bordered={false}
              style={{ width: 300, color: "white", background: "rgba(50, 50, 50, 0.5)", textShadow: "0 1px 5px rgba(0,0,0,.1)" }}
            >
              {todos.map((todo, index) => {
                return (
                  <p>
                    <Checkbox onChange={() => { this.markComplete(index) }} checked={todo.completed}></Checkbox>
                    {todo.completed ? (
                      <span style={{ textDecoration: 'line-through', fontSize: '15px' }}> {todo.title} </span>
                    ) : (
                        <span> {todo.title} </span>
                      )}
                    <Icon style={{ color: 'red' }} type="delete" onClick={() => {this.delTodo(index)}}></Icon> </p>
                );
              })}

              <Row>
                <Col span={20}>
                  <Input
                    style={{
                      borderWidth: '3px', borderTopStyle: 'none', borderLeftStyle: 'none', borderRightStyle: 'none',
                      color: 'white', borderBottomColor: 'white', background: 'transparent'
                      , textShadow: '0 1px 5px rgba(0,0,0,.1)'
                    }}
                    value={this.state.todo}
                    name="todo"
                    onChange={this.handleChange}
                  ></Input>
                  </Col>
                <Col span={4}>
                  <Button type="primary" icon="plus" onClick={this.addTodo}></Button>
                </Col>
              </Row>

            </Card>
          </div>,
        </div>

      </div>
    );
  }
};

export default App;
