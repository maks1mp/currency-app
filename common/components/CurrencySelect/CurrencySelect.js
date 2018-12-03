import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {fetchWeeklyData, changeCurrency} from '../../actions';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import {withStyles} from '@material-ui/core';

const style = theme => ({
    root: {
        fontFamily: theme.typography.fontFamily
    },
    select: {
        minWidth: '180px'
    }
})
class CurrencySelect extends React.Component {
    static propTypes = {
        currency: PropTypes.string,
        list: PropTypes.arrayOf(PropTypes.string),
        classes: PropTypes.object
    }

    handleChange = e => {
        const {dispatch, currency} = this.props,
            {value} = e.target;

        if (value !== currency) {
            value ? dispatch(fetchWeeklyData(value)) : dispatch(changeCurrency(value));
        }
    }

    render() {
        const {currency, list, classes} = this.props;

        return (
            <div className={classes.root}>
                <FormControl>
                    <InputLabel shrink htmlFor='currency'>
                        Choose working currency
                    </InputLabel>
                    <Select
                        className={classes.select}
                        value={currency}
                        onChange={this.handleChange}
                        displayEmpty
                        inputProps={{
                            name: 'currency',
                            id: 'currency'
                        }}>
                            <MenuItem value={''}>
                                <em>Choose value</em>
                            </MenuItem>
                            {list.map(listItem => <MenuItem value={listItem} key={listItem}>{listItem}</MenuItem>)}
                    </Select>
                </FormControl>
            </div>
        );
    }
}

const mapStateToProps = ({currency, list}) => ({currency, list});

export default connect(mapStateToProps)(withStyles(style)(CurrencySelect));