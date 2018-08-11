import React from 'react';
import { Transition, animated } from 'react-spring';
import './BannerTwo.css';

const pages = [
  style => (
    <animated.div style={{ ...style, background: '#247BA0' }}>A</animated.div>
  ),
  style => (
    <animated.div style={{ ...style, background: '#B2DBBF' }}>B</animated.div>
  ),
  style => (
    <animated.div style={{ ...style, background: '#12DBBF' }}>C</animated.div>
  ),
];

export default class BannerTwo extends React.PureComponent {
  state = { index: 0 };
  toggle = e =>
    this.setState(state => ({
      index: state.index === 2 ? 0 : state.index + 1,
    }));
  render() {
    return (
      <div className="main" onClick={this.toggle}>
        <Transition
          native
          from={{ opacity: 0, transform: 'translate3d(100%,0,0)' }}
          enter={{ opacity: 1, transform: 'translate3d(0%,0,0)' }}
          leave={{ opacity: 0, transform: 'translate3d(-50%,0,0)' }}
        >
          {pages[this.state.index]}
        </Transition>
      </div>
    );
  }
}
