require('dotenv').config();
const { ROLLBAR_TOKEN } = process.env;
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const {bots, playerRecord} = require('./data');
const {shuffleArray} = require('./utils');

app.use(express.json());
app.use(cors());

// include and initialize the rollbar library with your access token
const Rollbar = require('rollbar');
const rollbar = new Rollbar({
  accessToken: ROLLBAR_TOKEN,
  captureUncaught: true,
  captureUnhandledRejections: true,
});

// record a generic message and send it to Rollbar
rollbar.log('Hello world!');

app.use(express.static(path.join(__dirname, './public')));
app.use('/styles', express.static(path.join(__dirname, './public/index.css')));
app.use('/js', express.static(path.join(__dirname, './public/index.js')));

// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, './public/index.html'));
// });

// app.get('/styles', (req, res) => {
//     res.sendFile(path.join(__dirname, './public/index.css'));
// });

// app.get('/js', (req, res) => {
//     res.sendFile(path.join(__dirname, './public/index.js'));
// });

app.get('/api/robots', (req, res) => {
    rollbar.info('GET - /api/robots');
    try {
        rollbar.log('Bots retrieved sucessfully', { response: botsArr });
        res.status(200).send(botsArr);
    } catch (error) {
        rollbar.error('Error retrieving bots', { error });
        console.log('ERROR GETTING BOTS', error);
        res.sendStatus(400);
    };
});

app.get('/api/robots/five', (req, res) => {
    rollbar.info('GET - /api/robots/five');
    try {
        let shuffled = shuffleArray(bots);
        let choices = shuffled.slice(0, 5);
        let compDuo = shuffled.slice(6, 8);
        rollbar.log('Five bots retrieved sucessfully', { response: { choices, compDuo } });
        res.status(200).send({choices, compDuo});
    } catch (error) {
        rollbar.error('Error retrieving five bots', { error });
        console.log('ERROR GETTING FIVE BOTS', error);
        res.sendStatus(400);
    };
});

app.post('/api/duel', (req, res) => {
    rollbar.info('GET - /api/duel');
    try {
        // getting the duos from the front end
        let {compDuo, playerDuo} = req.body;

        // adding up the computer player's total health and attack damage
        let compHealth = compDuo[0].health + compDuo[1].health;
        let compAttack = compDuo[0].attacks[0].damage + compDuo[0].attacks[1].damage + compDuo[1].attacks[0].damage + compDuo[1].attacks[1].damage;
        
        // adding up the player's total health and attack damage
        let playerHealth = playerDuo[0].health + playerDuo[1].health
        let playerAttack = playerDuo[0].attacks[0].damage + playerDuo[0].attacks[1].damage + playerDuo[1].attacks[0].damage + playerDuo[1].attacks[1].damage;
        
        // calculating how much health is left after the attacks on each other
        let compHealthAfterAttack = compHealth - playerAttack;
        let playerHealthAfterAttack = playerHealth - compAttack;

        // comparing the total health to determine a winner
        if (compHealthAfterAttack > playerHealthAfterAttack) {
            playerRecord.losses++;
            rollbar.log('Duel concluded', { response: { playerWin: false, playerRecord } });
            res.status(200).send('You lost!');
        } else {
            playerRecord.losses++;
            rollbar.log('Duel concluded', { response: { playerWin: true, playerRecord } });
            res.status(200).send(';You won!')
        }
    } catch (error) {
        rollbar.error('Error dueling', { error });
        console.log('ERROR DUELING', error);
        res.sendStatus(400);
    };
});

app.get('/api/player', (req, res) => {
    rollbar.info('GET - /api/player');
    try {
        rollbar.log('Player stats retrieved sucessfully', { response: playerRecord });
        res.status(200).send(playerRecord);
    } catch (error) {
        rollbar.error('Error getting player stats', { error });
        console.log('ERROR GETTING PLAYER STATS', error);
        res.sendStatus(400);
    };
});

app.use(rollbar.errorHandler());

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});