import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import Quizz from 'containers/Quizz.jsx';
import configureStore from 'store';

// eslint-disable-next-line no-underscore-dangle
const store = configureStore(window.__INITIAL_STATE__);

const component = (
  <Provider store={store}>
    <Quizz />
  </Provider>
);

render(component);
