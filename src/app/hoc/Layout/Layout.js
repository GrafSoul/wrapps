import React, { Component } from 'react';

import classes from './layout.module.scss';

import Aux from '../../hoc/AuxComponent/AuxComponent';

const { remote } = window.require('electron');
const mainWindow = remote.getCurrentWindow();

class Layout extends Component {
    state = {
        title: 'WrappS 1.2.0',
        showSideDrawer: false,
        statusWindow: false,
    };

    handleMinimizeWindow = () => {
        mainWindow.hide();
    };

    handleCloseWindow = () => {
        mainWindow.close();
    };

    sideDrawerClosedHandler = () => {
        this.setState({ showSideDrawer: false });
    };

    sideDrawerToggleHandler = () => {
        this.setState((prevState) => {
            return { showSideDrawer: !prevState.showSideDrawer };
        });
    };

    render() {
        return (
            <Aux>
                <div className={classes.layout}>
                    <div className={classes.topbar}>
                        <div className={classes.title}>
                            <i className="fas fa-film"></i>
                            {this.state.title}
                        </div>
                        <div>
                            <button
                                className={classes.btnWindow}
                                onClick={this.handleMinimizeWindow}
                            >
                                <i className="fal fa-window-minimize" />
                            </button>
                            <button
                                className={
                                    classes.btnWindow +
                                    ' ' +
                                    classes.closeWindow
                                }
                                onClick={this.handleCloseWindow}
                            >
                                <i className="fal fa-window-close" />
                            </button>
                        </div>
                    </div>

                    <main className={classes.content}>
                        {this.props.children}
                    </main>
                </div>
            </Aux>
        );
    }
}

export default Layout;
