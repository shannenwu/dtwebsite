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
            <Menu borderless compact fluid vertical>
                <Menu.Item as={Link} to='/'>
                    Home
                </Menu.Item>
                <Menu.Item as={Link} to='/about'>
                    About
                </Menu.Item>
                { this.props.userInfo === null ? (
                    <Menu.Item as={Link} to='/login'>
                        Login
                    </Menu.Item>
                ) : (
                    <Menu.Item as={Link} to='/logout'>
                        Logout
                    </Menu.Item>
                )}
            </Menu>
        );
    }
}

export default NavBar;