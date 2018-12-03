import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import {withStyles} from '@material-ui/core/styles';
import CurrencyCalculatorToggle from './CurrencyCalculatorToggle';
import CurrencyCalculatorResult from './CurrencyCalculatorResult';

const styles = theme => ({
    root: {
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        padding: '16px'
    },
    result: {
        justifyContent: 'flex-end'
    }
  });
class CurrencyCalculator extends React.Component {
    static propTypes = {
        initialValue: PropTypes.number,
        selectValues: PropTypes.arrayOf(PropTypes.string),
        currency: PropTypes.string,
        exchangeData: PropTypes.arrayOf(PropTypes.object)
    }

    static getDerivedStateFromProps(props, state) {
        if (!props.selectValues.includes(state.choosenDate)) {
            return {
                ...state,
                choosenDate: props.selectValues[0]
            };
        }

        return state;
    }

    constructor(props) {
        super(props);

        this.state = {
            choosenDate: '',
            reverse: false,
            value: props.initialValue
        };
    }

    handleFieldChange = (key, toNumber = false) => e => {
        this.setState({[key]: toNumber ? +e.target.value : e.target.value});
    }

    reverseCounter = () => {
        this.setState(prevState => ({
            reverse: !prevState.reverse
        }));
    }

    renderCalculator() {
        const {selectValues, exchangeData, currency, classes} = this.props,
            {choosenDate, value, reverse} = this.state,
            {rate} = exchangeData.find(dayDate => dayDate.exchangedate === choosenDate) || {},
            childCommonProps = {
                currency,
                reverse
            };

        return (currency && rate) ? (
            <div>
                <Grid container className={classes.root}>
                    <TextField
                        type='number'
                        className={classes.field}
                        label='Value'
                        value={value === 0 ? '' : value}
                        onChange={this.handleFieldChange('value', true)}/>
                    <FormControl className={classes.field}>
                        <InputLabel shrink htmlFor='choosenDate'>
                            Date
                        </InputLabel>
                        <Select
                            value={choosenDate}
                            onChange={this.handleFieldChange('choosenDate')}
                            inputProps={{
                                name: 'choosenDate',
                                id: 'choosenDate'
                            }}>
                            {selectValues.map(value => <MenuItem value={value} key={value}>{value}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <CurrencyCalculatorToggle
                        {...childCommonProps}
                        reverseCounter={this.reverseCounter}/>
                </Grid>
                <Grid container className={classes.result}>
                    <CurrencyCalculatorResult
                        {...childCommonProps}
                        value={value}
                        rate={rate}/>
                </Grid>
            </div>
        ) : null;
    }

    render() {
        const {currency} = this.props;

        return currency ? this.renderCalculator() : null;
    }
}

const mapStateToProps = state => {
    const {value, exchangeData, currency} = state,
        validExchangeData = exchangeData
            .filter(dayData => dayData && dayData.exchangedate),
        selectValues = validExchangeData.map(dayData => dayData.exchangedate);

    return {
        initialValue: value,
        selectValues: [...selectValues].reverse(),
        exchangeData: validExchangeData,
        currency
    };
}

export default connect(mapStateToProps)(withStyles(styles)(CurrencyCalculator));