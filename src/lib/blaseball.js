const nodeFetch = require('node-fetch');
const fetchCookie = require('fetch-cookie');
const EventSource = require('eventsource');

// May be reverse engineered correctly, then again, maybe not!
const Weather = {
    VOID: 0,
    SUNNY: 1,
    OVERCAST: 2,
    RAINY: 3,
    SANDSTORM: 4,
    SNOWY: 5,
    ACIDIC: 6,
    SOLAR_ECLIPSE: 7,
    GLITTER: 8,
    BLOODWIND: 9,
    PEANUTS: 10,
    BIRDS: 11,
    FEEDBACK: 12
}

class Blaseball {
    loginUrl = "https://www.blaseball.com/auth/local";
    eventSourceUrl = "https://www.blaseball.com/events/streamData";
    loginCookies = null;


    constructor(username, password) {
        this.username = username;
        this.password = password;

        this.fetch = fetchCookie(nodeFetch);
    }


    async login() {
        const data = {
            username: this.username,
            password: this.password,
            isLogin: true,
        }

        return this.fetch(
            this.loginUrl,
            {
                method: 'post',
                body: JSON.stringify(data),
                headers: {'Content-Type': 'application/json'}
            }
        ).then(response => {
            this.loginCookies = response.headers.get('set-cookie');
            return response;
        });
    }

    deployPeanuts() {
        // Do... something. A blocking attempt which stops when out of peanuts?
    }

    streamData() {
        return new EventSource(
            this.eventSourceUrl,
            {headers: {'Cookie': this.loginCookies}}
        );
    }
}

module.exports = { Blaseball, Weather }
