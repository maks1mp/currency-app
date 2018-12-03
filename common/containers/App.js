import React from 'react';
import {PropTypes} from 'prop-types';
import CurrencySelect from '../components/CurrencySelect/CurrencySelect';
import CurrencyCalculator from '../components/CurrencyCalculator/CurrencyCalculator';
import Chart from '../components/Chart/Chart';
import {withStyles} from '@material-ui/core';

const style = theme => ({
    root: {
        'max-width': '800px',
        margin: '20px auto'
    },
    title: {
        fontWeight: 400,
        fontFamily: theme.typography.fontFamily
    }
});

function App({classes}) {
    return (
        <div className={classes.root}>
            <h1 className={classes.title}>Currency calculator</h1>
            <CurrencySelect/>
            <Chart/>
            <CurrencyCalculator/>
        </div>
    )
}

App.propTypes = {
    classes: PropTypes.object
};

export default withStyles(style)(App);