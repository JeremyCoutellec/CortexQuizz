import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import actions from 'actions';

class Quizz extends Component {
  constructor() {
    super();
  }

  componentDidMount() {
  }

  render() {
    return (
      <div>Coucou</div>
    );
  }
}

Quizz.propTypes = {
};

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps)(Quizz);
