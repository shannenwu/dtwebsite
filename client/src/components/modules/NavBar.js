import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';

class NavBar extends Component {
    constructor(props) {
        super(props);

        this.state = {
        }
    }

    render() {
        return (
            <Menu inverted vertical>
              <Menu.Item 
                name='home'  />
              <Menu.Item
                name='about'
              />
            </Menu>
        );
    }
}

export default NavBar;