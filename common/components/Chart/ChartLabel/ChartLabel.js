import React from 'react';
import PropTypes from 'prop-types';
import Chip from '@material-ui/core/Chip';
import {withStyles} from '@material-ui/core/styles';

const style = {
    root: {
        fontSize: '18px'
    }
};

class ChartLabel extends React.Component {
    static propTypes = {
        payload: PropTypes.array,
        label: PropTypes.string,
        classes: PropTypes.object
    }

    render() {
        const {payload, classes} = this.props,
            {payload: rateInfo = {}} = payload.find(data => data.payload.rate) || {};

        return rateInfo.rate
            ? <Chip
                className={classes.root}
                label={rateInfo.rate}/>
            : null;
    }
}

export default withStyles(style)(ChartLabel);