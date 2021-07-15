import React from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import "./App.css";

const client = new W3CWebSocket("ws://localhost:8080/", "echo-protocol");

client.onerror = function () {
  console.log("Connection Error");
};
client.onclose = function () {
  console.log("echo-protocol Client Closed");
};
client.onopen = () => {
  console.log("WebSocket Client Connected");
};

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      textInput: "",
      message: [],
      userName: "",
    };
    this.updateText = this.updateText.bind(this);
    this.onClickHandler = this.onClickHandler.bind(this);
  }

  componentDidMount() {
    const name = window.prompt("Enter your name");
    this.setState({
      userName: name,
    });
    client.onmessage = (message) => {
      let msgObj = JSON.parse(message.data);

      this.setState((state) => {
        return {
          message: Array.isArray(msgObj)
            ? [...state.message, ...msgObj]
            : [...state.message, msgObj],
        };
      });
      console.log(msgObj);
    };
  }

  updateText(e) {
    this.setState({
      textInput: e.target.value,
    });
  }

  onClickHandler() {
    const msg = {
      name: this.state.userName,
      message: this.state.textInput,
    };
    if (client.readyState === client.OPEN) {
      client.send(JSON.stringify(msg));
    }
    this.setState({
      textInput: "",
    });
  }

  render() {
    const messageJSX = this.state.message.map((item) => {
      return (
        <div
          className={item.name === this.state.userName && "my-msg-container"}
          key={item.id}
        >
          <span
            className={
              item.name === this.state.userName
                ? "text-msg my-msg"
                : "text-msg other-msg"
            }
          >
            {" "}
            {item.message}
          </span>
          <p className="sender">
            {" "}
            {item.name} | {new Date(item.timestamp).toDateString()}{" "}
          </p>
        </div>
      );
    });
    return (
      <div className="parent-container">
        <div className="container">
          <div className="top-bar">
            <p className="name">{this.state.userName}</p>
            <i class="fas fa-user-circle"></i>
          </div>
          <div className="msg-container">
            {messageJSX}

            <div className="textarea-btn">
              <textarea
                className="textarea"
                id="message"
                name="message"
                placeholder="Enter your message"
                value={this.state.textInput}
                onChange={this.updateText}
              />
              <button onClick={this.onClickHandler}> Submit </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
