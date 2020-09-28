const Kraken = require('node-crypto-api').Kraken,
    kraken = new Kraken();
const notifier = require('node-notifier');
const inquirer = require('inquirer');
const chalk = require('chalk');

inquirer.prompt([{
        type: 'input',
        name: 'targetEthPrice',
        message: "What price would you like to be notified on (in USD, for ETH)?",
        validate: (value) => {
            var test = Number(value);
            if (test) {
                return true;
            } else {
                console.log(chalk.red.bold('\nInput failed the conversion test, do not enter "0" or a non-numeric value.'))
            }
        }
    }])
    .then(answers => {
        console.log(`Starting ${chalk.bold.white('EthStonksWhen')} to check the price of ${chalk.bold.white('ETH')} every ${chalk.bold.white('1 minute')}.`)
        setInterval(() => {
            kraken.ticker('ETH', 'USD')
                .then(data => {
                    let currentEthPrice = Number(data.result.XETHZUSD.o) // Gets the price of ETH
                    let targetEthPrice = Number(answers.targetEthPrice);

                    if (currentEthPrice >= targetEthPrice) {
                        notifier.notify({
                                title: `ETH is Stonks!`,
                                message: `ETH has reached ${targetEthPrice} USD!`,
                                appID: 'Made by Hextanium#5890, for salad.io!',
                                sound: true, // Only Notification Center or Windows Toasters
                                wait: true // Wait with callback, until user action is taken against notification, does not apply to Windows Toasters as they always wait or notify-send as it does not support the wait option
                            },
                            function (err, response) {
                                err ? console.error(err) : true;
                                process.exit(0)
                            }
                        );
                    } else {
                        console.log(`ETH does not meet the critera of ${targetEthPrice} USD.`);
                    }
                })
                .catch(error => {
                    console.error(error)
                });
        }, 60 * 1000);
    })
    .catch(error => {
        if (error.isTtyError) {
            console.log('There was an error rendering the prompt in your terminal window.\nTry not to resize it during the prompts.')
        } else {
            console.log('There was an unknown error.')
        }
    });