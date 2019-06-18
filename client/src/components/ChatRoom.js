import React from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";

const client = new W3CWebSocket('ws://localhost:8999');

export default class ChatRoom extends React.Component {
 
    constructor(props) {
      super(props);
      this.state = {
        message: null,
        username: null
      };
    }

    handleData(data) {
        let result = JSON.parse(data);
        this.setState({message: result});
    }

    handleSend(message) {
        console.log(message);
        client.send(JSON.stringify({
            type: "contentchange",
            sender: this.state.username,
            content: message,
            isBroadcast: false
        }));
    }

    handleChange(e) {
        this.setState(
            {
                input: e.target.value
            }
        )
    }

    componentWillMount() {
        client.onopen = () => {
          console.log('WebSocket Client Connected');
        };
        client.onmessage = (message) => {
          console.log(message.data);
          this.setState({
              message: JSON.parse(message.data)
          })
        };
    }

    render() {
        const { input, message } = this.state;
        return (
            <div>
                <h2>ChatRoom</h2>
                <div>
                    <div>
                        Write smth: 
                        <input
                            onChange={(e) => {this.handleChange(e)}}
                        />
                        <button onClick={() => {this.handleSend(input)}}>Send</button>
                    </div>
                    <div>
                        Message: <strong>{message ? message.content : ''}</strong>
                    </div>
                    <div>
                        From: <strong>{message ? message.sender: ''}</strong>
                    </div>
                </div>
            </div>
        );
    }
}
