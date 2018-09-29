import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import Parallax from 'components/material-kit-react/Parallax/Parallax';

import Header from 'components/Header/Header';
import Footer from 'components/Footer/Footer';
import HeaderLinks from 'components/Header/HeaderLinks';

import profileBg from 'assets/img/profile-bg.jpg';

import logo from 'logo.svg';

class LoggedIn extends React.Component {
  render() {
    const { children } = this.props;

    return (
      <div>
        <Header
          brand={
            <Link to="/">
              <img src={logo} alt="MiFADU" height={48} />
            </Link>
          }
          rightLinks={<HeaderLinks />}
          fixed
          changeColorOnScroll={{
            height: 200,
            color: 'white',
          }}
        />
        <Parallax small filter image={profileBg} />
        {children}
        <Footer />
      </div>
    );
  }
}

LoggedIn.propTypes = {
  children: PropTypes.node.isRequired,
};

export default LoggedIn;
