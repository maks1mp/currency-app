import React from 'react';
import PropTypes from 'prop-types';
import {withStyles}  from '@material-ui/core/styles';
import {cut, UAH} from '../../utils';

const style = theme => ({
    root: {
        padding: '16px',
        fontFamily: theme.typography.fontFamily,
        fontSize: '16px'
    }
})

function CurrencyCalculatorResult({reverse, value, rate, currency, classes}) {
    const [result, currencyLabel] = [
        [String(cut(value / rate)), currency],
        [String(cut(value * rate)), UAH]
    ][reverse ? 0 : 1];

    return (
        <span className={classes.root}>
            Result: {result} {currencyLabel}
        </span>
    );
}

CurrencyCalculatorResult.propTypes = {
    reverse: PropTypes.bool,
    value: PropTypes.number,
    rate: PropTypes.number,
    currency: PropTypes.string,
    classes: PropTypes.object
}

export default withStyles(style)(CurrencyCalculatorResult);