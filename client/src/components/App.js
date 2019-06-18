import React, { Component } from "react";
import ChatRoom from './ChatRoom.js';
import { AppContainer } from '../styles/App.styles';

class App extends Component {
    render() {
        return (
            <AppContainer>
                <div>
                    <h1>My React Chat App!</h1>
                    <ChatRoom />
                </div>
            </AppContainer>
        );
    }
}

export default App;