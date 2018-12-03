import API from '../api/index';
import {DAYS_QUANTITY} from '../utils';

export const CHANGE_CURRENCY = 'CHANGE_CURRENCY';
export const SHOW_LOADER = 'SHOW_LOADER';
export const HIDE_LOADER = 'HIDE_LOADER';
export const FINISH_UPLOAD_DATA = 'FINISH_UPLOAD_DATA';

export function changeCurrency(currency) {
	return {
		type: CHANGE_CURRENCY,
		currency
	};
}

export function changeCurrencyAndStopLoader(currency) {
	return {
		type: CHANGE_CURRENCY + HIDE_LOADER,
		currency
	}
}

export function updateExchangeDataWithLoaderToggle(exchangeData) {
	return {
		type: FINISH_UPLOAD_DATA + HIDE_LOADER,
		exchangeData
	};
}

export function changeCurrencyWithLoaderToggle(currency) {
	return {
		type: CHANGE_CURRENCY + SHOW_LOADER,
		currency
	};
}

export function fetchWeeklyData(currency) {
	return dispatch => {
		dispatch(changeCurrencyWithLoaderToggle(currency));

		API.fetchCurrencyForPreviosDays(currency, DAYS_QUANTITY)
			.then(data => dispatch(updateExchangeDataWithLoaderToggle(data)))
			.catch(() => {
				dispatch(changeCurrencyAndStopLoader(''));
				alert('Error fetching data, try again');
			})
	}
}