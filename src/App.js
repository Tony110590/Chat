import React, { Component } from "react";
import "./App.css";
import Messages from "./Components/Messages";
import Input from "./Components/Input";

function randomName() {
  const firstNames = [
    "Mensur",
    "Jona",
    "Davor",
    "Frane",
    "Marijan",
    "ZdeslavBot",
    "Toni",
    "Serge",
  ];
  const lastNames = [
    "Hodler",
    "Bot",
    "Gamer",
    "CryptoManijak",
    "Jungle",
    "SoloTop",
    "Mid",
    "Sup4Life",
  ];
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  return firstName + "" + lastName;
}

function randomColor() {
  return "#" + Math.floor(Math.random() * 0xffffff).toString(16);
}

class App extends Component {
  state = {
    messages: [],
    member: {
      username: randomName(),
      color: randomColor(),
    },
  };

  constructor() {
    super();
    this.drone = new window.Scaledrone(
      process.env.REACT_APP_SCALEDRONE_API_KEY,
      {
        data: this.state.member,
      }
    );
    this.drone.on("open", (error) => {
      if (error) {
        return console.log(error);
      }
      const member = { ...this.state.member };
      member.id = this.drone.clienId;
      this.setState({ member });
    });
    const room = this.drone.subscribe("observable-room");
    room.on("data", (data, member) => {
      const messages = this.state.messages;
      messages.push({ member, text: data });
      this.setState({ messages });
    });
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h1 className="App-header-title">Hodlers chat</h1>
        </div>
        <Messages
          messages={this.state.messages}
          currentMember={this.state.member}
        />
        <Input onSendMessage={this.onSendMessage} />
      </div>
    );
  }

  onSendMessage = (message) => {
    this.drone.publish({
      room: "observable-room",
      message,
    });
  };
}

export default App;
