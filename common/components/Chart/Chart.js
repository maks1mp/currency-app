import React from 'react';
import {PropTypes} from 'prop-types';
import {connect} from 'react-redux';
import {cut, CHART_INCREASER} from '../../utils';
import ChartLabel from './ChartLabel/ChartLabel';
import CircularProgress from '@material-ui/core/CircularProgress';
import {withStyles} from '@material-ui/core/styles';
import {LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer} from 'recharts';

const style = theme => ({
    chart: {
        fontFamily: theme.typography.fontFamily,
        fontSize: '14px',
        position: 'relative',
        left: '-20px',
        height: '300px'
    },
    loader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px'
    }
});

class Chart extends React.Component {
    static defaultProps = {
        chartRateStart: 0,
        chartRateEnd: 1,
        existChartData: false,
        legendLabel: ''
    }

    static propTypes = {
        chartRateStart: PropTypes.number,
        chartRateEnd: PropTypes.number,
        existChartData: PropTypes.bool,
        loading: PropTypes.bool,
        legendLabel: PropTypes.string,
        chart: PropTypes.arrayOf(PropTypes.object)
    }

    renderChart() {
        const {existChartData, chart, chartRateStart, chartRateEnd, legendLabel, classes} = this.props;

        return existChartData && legendLabel && (
            <div className={classes.chart}>
                <ResponsiveContainer>
                    <LineChart
                        id='chart'
                        data={chart}>
                            <XAxis dataKey='exchangedate'/>
                            <YAxis dataKey='rate' domain={[chartRateStart, chartRateEnd]}/>
                            <CartesianGrid strokeDasharray="3 3"/>
                            <Legend
                                iconType={'circle'}
                                verticalAlign="top"
                                height={36}
                                payload={[{value: legendLabel, color: '#82ca9d'}]}/>
                            <Tooltip content={<ChartLabel/>}/>
                            <Line type='monotone' dataKey='exchangedate' stroke='#8884d8'/>
                            <Line type='monotone' dataKey='rate' stroke='#82ca9d' />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        );
    }

    renderLoader() {
        const {classes} = this.props;

        return (
            <div className={classes.loader}>
                <CircularProgress/>
            </div>
        )
    }

    render() {
        const {loading} = this.props;

        return loading ? this.renderLoader() : this.renderChart()
    }
}

const mapStateToProps = state => {
    const {exchangeData, loading, currency} = state,
        hasRate = dayData => dayData && dayData.rate,
        rates = exchangeData
            .filter(hasRate)
            .map(dayData => cut(dayData.rate));

    const selectedState = {
        chart: exchangeData
            .filter(hasRate)
            .map(dayData => ({...dayData, rate: cut(dayData.rate)})),
        loading,
        existChartData: exchangeData.length > 0,
        legendLabel: currency
    };

    if (rates.length > 0) {
        Object.assign(selectedState, {
            chartRateStart: cut(Math.min(...rates) - CHART_INCREASER),
            chartRateEnd: cut(Math.max(...rates) + CHART_INCREASER)
        });
    }

    return selectedState;
};

export default connect(mapStateToProps)(withStyles(style)(Chart));