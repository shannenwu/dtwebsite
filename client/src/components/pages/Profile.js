import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Profile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: null,
            id: null,
        };
    }

    static propTypes = {
        userInfo: PropTypes.object
    }

    static defaultProps = {
        userInfo: null,
    }

    componentDidMount() {
        // this.getProfile(this.props.match.params.user);
        document.title = "Profile Page";
    }


    render() {
        return (
            <div>
                Profile Page!
            </div>
        )
    }

    // getProfile = (id) => {
    //     fetch("/api/user?_id=" + id)
    //         .then(res => res.json())
    //         .then(
    //             userObj => {
    //                 this.setState({
    //                     name: userObj.name,
    //                     latestPost: userObj.last_post,
    //                     id: id
    //                 });
    //             }
    //         );
    // }
}

export default Profile;