import React from 'react';
import PropTypes from 'prop-types';

import Header from 'components/Header/Header';
import Footer from 'components/Footer/Footer';
import HeaderLinks from 'components/Header/HeaderLinks';

import logo from 'assets/img/logo.svg';

class LoggedIn extends React.Component {
  render() {
    const { children, me, logoutUser } = this.props;

    return (
      <div>
        <Header
          brand={<img src={logo} alt="MiFADU" height={48} />}
          rightLinks={<HeaderLinks me={me} logoutUser={logoutUser} />}
          fixed
          changeColorOnScroll={{
            height: 200,
            color: 'white',
          }}
        />
        {children}
        <Footer />
      </div>
    );
  }
}

LoggedIn.propTypes = {
  children: PropTypes.node.isRequired,
  me: PropTypes.object.isRequired,
  logoutUser: PropTypes.func.isRequired,
};

export default LoggedIn;
