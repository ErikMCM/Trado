module.exports = function () {
const readline = require("readline")
const request = require("request")
const puppeteer = require('puppeteer-core');
const download = require("download-chromium")
const os = require('os');
const tmp = os.tmpdir();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let working = true
let price = 0
let browser = null

function calculate() {
    working = true
    let finalNumber = 0

    //The percent that we want to get.
    //i.e. We want to get 22% of 90.
    let percentToGet = 42.86;

    //Turn our percent into a decimal figure.
    //22 will become 0.22 and 60 will become 0.6
    let percentAsDecimal = (percentToGet / 100);

    //Multiply the percent decimal by the number.
    let percent = percentAsDecimal * price;

    let added = price + percent



    //The percent that we want to get.
    //i.e. We want to get 22% of 90.
    let percentToGeta = 30;

    //Turn our percent into a decimal figure.
    //22 will become 0.22 and 60 will become 0.6
    let percentAsDecimala = (percentToGeta / 100);

    //Multiply the percent decimal by the number.
    finalNumber = Math.ceil(added - percentAsDecimala);

    working = false
    console.log(`\x1b[36m`, "To make back " + price + " Robux, you would need to sell the limited product for " + finalNumber + " Robux", "\x1b[0m")
};

function lookup(args) {
    working = true
    console.log("\x1b[32m", "Loading, this will take a moment...")
    const url = "https://catalog.roblox.com/v1/search/items/details?Category=2&Keyword=" + args


    console.log(" Sending API Request...")
    request(url, { json: true }, (err, res, body) => {
        try {
            let safeArgs = args
            const itemStats = body.data.find(item => item.name.toLowerCase() == args.toLowerCase());
            if (itemStats) {
                console.log(" Got API Data, now grabbing RAP...")
                const fetchData = async () => {
                    console.log(" Starting browser...")


                    page = await browser.newPage();
                    console.log(" Loading RAP...\n ")
                    await page.goto(`https://www.roblox.com/catalog/${itemStats.id}`, { waitUntil: 'load' });


                    const newPage = await page.evaluate(() => {
                        return document.getElementById("item-average-price").innerHTML;

                    })

                    let rap = await newPage

                    working = false
                    console.log(`\x1b[36m`, `${itemStats.name} Statistics:\n Product Id: ${itemStats.id}\n URL: https://www.roblox.com/catalog/${itemStats.id}/\n Lowest Current Sale Price: ${itemStats.lowestPrice} Robux\n RAP: ${rap} Robux`, "\x1b[0m")
                };
                fetchData()

            } else {
                console.log("\x1b[31m", "Item " + safeArgs + " was not found!", "\x1b[0m")
                working = false
            }
        } catch (e) {
            console.log("\x1b[31m", "Item " + args + " was not found!", "\x1b[0m")
            working = false
        }
    })
}



async function startUp() {
    console.log("\x1b[32m", "Initializing... Please wait a moment as this could take a little while.")
    console.log(" Initializing headless browser...")
    const exec = await download({
        revision: 694644,
        installPath: `${tmp}/.local-chromium`
    })
    console.log(" Headless browser initialized, Launching..,")
    browser = await puppeteer.launch({ executablePath: exec });
    console.log(" Browser launched, initialization complete!\n\n", "\x1b[0m")
    console.log(`\x1b[36m`, ` Thank you for using Trado!\n\n`)
    console.log("\x1b[33m", ` To begin, type "help".`, "\x1b[0m")
    working = false
}

startUp()
//console.log("What is the price of the limited?")


rl.on('line', function (line) {
    if (working == true) {return}
    let args = line.split(" ");
    //Server Handler
    switch (args[0]) {
        case 'close':
            rl.close()
            break;
        case 'exit':
            rl.close()
            break;
        case 'help':
            console.log("\x1b[33m", `Commands:\n "help" - Displays this prompt\n "exit" - Close this process\n "calculate" [product price] - Calculates the price you would have to resell for, inorder to make your money back\n "lookup" [product name] - Looks up the product`, "\x1b[0m")
            break;
        case 'calculate':
            price = parseInt(args.slice(1).join(" "), 10)
            calculate()
            break;
        case 'lookup':
            lookup(args.slice(1).join(" "))
            break;
        /*
        default:
            console.log(`Sorry, I didn't undertsand ${line.trim()}, please run help for a list of commands`);
            break;
            */
    }
})

rl.on("close", function () {
    console.log("\x1b[31m", "Terminating process...", "\x1b[0m");
    process.exit(0);
});
}