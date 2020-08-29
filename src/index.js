#!/usr/bin/env node
const { Blaseball, Weather } = require('./lib/blaseball')
const prompt = require('prompt');

const schema = {
    properties: {
        username: {},
        password: {
            hidden: true
        }
    }
}

prompt.start();
prompt.get(schema, async (err, result) => {
    if (err) {
        console.log(err);
        return 1
    }

    const blaseball = new Blaseball(result.username, result.password);
    await blaseball.login();

    const eventStream = blaseball.streamData();

    let deployingPeanuts = false;

    eventStream.addEventListener('message', async message => {
        const messageObj = JSON.parse(message.data)
        const peanuts = messageObj.value.games.schedule.some((game) => game.weather === Weather.PEANUTS);

        // Deploy the peanuts
        if (peanuts && !deployingPeanuts) {
            console.log('PEANUTS DETECTED, DEPLOYING PEANUTS')
            deployingPeanuts = true;
            await blaseball.deployPeanuts();
            deployingPeanuts = false
        } else if (!peanuts) {
            console.log('NO PEANUTS DETECTED')
        }
    });
});

