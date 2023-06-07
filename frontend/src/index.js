import { ChakraProvider, ColorModeScript, theme } from '@chakra-ui/react';
import React from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ChatProvider } from './Context/chatProvider';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(
  <ChatProvider>
    <ColorModeScript />
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
    </BrowserRouter>
  </ChatProvider>
);
