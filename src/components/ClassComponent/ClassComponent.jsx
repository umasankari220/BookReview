import React, { Component } from 'react';

class ClassComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: 'Hello from Class Component!'
    };
  }

  render() {
    return (
      <div style={styles.container}>
        <h2>{this.state.message}</h2>
        <p>This is a class-based component example.</p>
      </div>
    );
  }
}

const styles = {
  container: {
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    margin: '1rem 0'
  }
};

export default ClassComponent;