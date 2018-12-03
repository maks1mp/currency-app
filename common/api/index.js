import fetch from 'node-fetch';
import {API_URL} from '../utils/index';

class API {
    constructor(url) {
        this.url = url;
    }

    createUrl(params) {
        return this.url + '?' + Object.keys(params).map(key => `${key}=${params[key]}`).join('&');
    }

    convertData(date) {
        const mm = date.getMonth() + 1,
            dd = date.getDate();

        return [date.getFullYear(),
            (mm > 9 ? '' : '0') + mm,
            (dd > 9 ? '' : '0') + dd
        ].join('');
    };

    toJS(response) {
        return response.json();
    }

    fetchList() {
        return fetch(this.createUrl({
                json: true,
                date: this.convertData(new Date())
            }))
            .then(this.toJS)
            .then(response => response.map(currency => currency.cc))
    }

    fetchCurrencyForDate(currency, date) {
        return fetch(this.createUrl({
                valcode: currency,
                date: this.convertData(date),
                json: true
            }))
            .then(this.toJS)
            .then(([data]) => data);
    }

    fetchCurrencyForPreviosDays(currency, n) {
        let daysQuantity = n - 1;
        const day = new Date(),
            datesToFetch = [new Date()];

        while (daysQuantity-- > 0) {
            datesToFetch.push(new Date(day.setDate(day.getDate() - 1)));
        }

        return Promise.all(datesToFetch.map(date => this.fetchCurrencyForDate(currency, date)))
            .then(data => data.sort((a, b) => {
                const aa = a.exchangedate.split('.').reverse().join(),
                    bb = b.exchangedate.split('.').reverse().join();

                return aa < bb ? -1 : (aa > bb ? 1 : 0);
            }));
    }
}

export default new API(API_URL);