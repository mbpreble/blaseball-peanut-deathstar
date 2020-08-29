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

    // Can I access publicly?
    const eventStream = blaseball.streamData();
    eventStream.addEventListener('message', message => {
        const messageObj = JSON.parse(message.data)
        const peanuts = messageObj.schedule.some((game) => game.weather === Weather.PEANUTS);

        // Deploy the peanut laser
        if (peanuts) {
            blaseball.deployPeanuts();
        }
    });
});

