import React from 'react';
import PropTypes from 'prop-types';
import Switch from '@material-ui/core/Switch';
import {withStyles} from '@material-ui/core/styles';
import {UAH} from '../../utils';

const styles = theme => ({
    root: {
        alignItems: 'center',
        position: 'relative',
        top: '10px',
        display: 'flex'
    },
    text: {
        fontFamily: theme.typography.fontFamily,
        fontSize: '16px'
    }
});

const delimeter = '-';

function CurrencyCalculatorToggle({reverse, currency, reverseCounter, classes}) {
    return (
        <div className={classes.root}>
            <span className={classes.text}>
                {[currency, UAH].join(delimeter)}
            </span>
            <Switch
                color='primary'
                checked={reverse}
                onChange={reverseCounter}/>
            <span className={classes.text}>
                {[UAH, currency].join(delimeter)}
            </span>
        </div>
    );
}

CurrencyCalculatorToggle.propTypes = {
    reverse: PropTypes.bool,
    currency: PropTypes.string,
    reverseCounter: PropTypes.func,
    classes: PropTypes.object
}

export default withStyles(styles)(CurrencyCalculatorToggle);