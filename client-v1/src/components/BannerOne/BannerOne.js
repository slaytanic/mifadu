import React from 'react';
import { Parallax } from 'react-spring';
import './BannerOne.css';
import ForegroundLayer from '../../images/banner_foreground.png';
// import MiddleLayer from '../../images/banner_middle.png';

const Page = ({ offset, caption, first, second, gradient, onClick }) => (
  <React.Fragment>
    <Parallax.Layer offset={offset} speed={0.2} onClick={onClick}>
      <div className="slopeBegin" />
    </Parallax.Layer>

    <Parallax.Layer offset={offset} speed={-0.2} onClick={onClick}>
      <div className={`slopeEnd ${gradient}`} />
    </Parallax.Layer>

    <Parallax.Layer className="text number" offset={offset} speed={0.3}>
      <span>0{offset + 1}</span>
    </Parallax.Layer>

    <Parallax.Layer className="text header" offset={offset} speed={0.4}>
      <span>
        <p style={{ fontSize: 20 }}>{caption}</p>
        <div className={`stripe ${gradient}`} />
        <p>{first}</p>
        <p>{second}</p>
      </span>
    </Parallax.Layer>

    <Parallax.Layer offset={offset} speed={0.2} onClick={onClick}>
      <img src={ForegroundLayer} />
    </Parallax.Layer>

    {/* <Parallax.Layer offset={offset} speed={0.2} onClick={onClick}>
      <img src={MiddleLayer} />
    </Parallax.Layer> */}
  </React.Fragment>
);

export default class BannerOne extends React.Component {
  scroll = to => this.refs.parallax.scrollTo(to);
  render() {
    return (
      <div className="main">
        <Parallax
          className="container"
          ref="parallax"
          pages={3}
          horizontal
          scrolling={false}
        >
          <Page
            offset={0}
            gradient="pink"
            caption="Entregas digitales"
            first="Lorem ipsum"
            second="dolor sit"
            onClick={() => this.scroll(1)}
          />
          <Page
            offset={1}
            gradient="teal"
            caption="Administración de usuarios"
            first="consectetur"
            second="adipiscing elit"
            onClick={() => this.scroll(2)}
          />
          <Page
            offset={2}
            gradient="tomato"
            caption="Estadísticas"
            first="Morbi quis"
            second="est dignissim"
            onClick={() => this.scroll(0)}
          />
        </Parallax>
      </div>
    );
  }
}
