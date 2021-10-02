const express = require('express')
const {getCovidInfoToday, getCovidInfoHistory,covidCompare,covidDeaths} = require('./covidApis')
const app = express()
const port = process.env.PORT || 3000
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerJson = require('./swagger')


const swaggerDocs = swaggerJsDoc(swaggerJson);

module.exports = app;

/**
 * @swagger
 * /daily/{country}:
 *   get:
 *     summary: Returns The daily covid 19 by country
 *     tags: [Covid19]
 *     parameters:
 *       - in: path
 *         name: country
 *         schema:
 *           type: string
 *         required: true
 *         description: The country you want the daily results
 *         default: Israel
 *     responses:
 *       200:
 *         description: The Number of covid cases
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 */

app.get('/daily/:country', async (req, res) => {
    const result = await getCovidInfoToday(req.params.country)
    if (result.status == 200 ){
    await res.send(`The Number of confirmed covid 19 cases in ${req.params.country} today is: ${result.data}`)
    }
    else {
        await res.sendStatus(result.status).send(result.data)
    }
})

/**
 * @swagger
 * /byDate/{country}/{date}:
 *   get:
 *     summary: Returns The daily covid 19 by country
 *     tags: [Covid19]
 *     parameters:
 *       - in: path
 *         name: country
 *         schema:
 *           type: string
 *         required: true
 *         default: Israel
 *         description: The country you want the results
 *       - in: path
 *         name: date
 *         schema:
 *           type: string
 *         required: true
 *         description: The country you want by date results (input must be xx-xx-xxxx day-mounth-year)
 *         default: 20-09-2021
 *     responses:
 *       200:
 *         description: The Number of covid cases
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 */

app.get('/byDate/:country/:date', async (req, res) => {
    const result = await getCovidInfoHistory(req.params.country, req.params.date)
    if (result.status == 200 ) {
        res.send(`The Number of confirmed covid 19 cases in ${req.params.country} by this date ${req.params.date} is: ${result.data}`)
    }else {
        await res.sendStatus(result.status).send(result.data)
    }
    })

/**
 * @swagger
 * /compare/{country1}/{country2}/{date1}/{date2}:
 *   get:
 *     summary: Returns The daily covid 19 by country
 *     tags: [Covid19]
 *     parameters:
 *       - in: path
 *         name: country1
 *         schema:
 *           type: string
 *         required: true
 *         default: Israel
 *         description: The countries you want to compare
 *       - in: path
 *         name: country2
 *         schema:
 *           type: string
 *         required: true
 *         default: France
 *         description: The countries you want to compare
 *       - in: path
 *         name: date1
 *         schema:
 *           type: string
 *         required: true
 *         description: The dates you want by compare (input must be xx-xx-xxxx day-mounth-year)
 *         default: 20-09-2021
 *       - in: path
 *         name: date2
 *         schema:
 *           type: string
 *         required: true
 *         description: The dates you want by compare (input must be xx-xx-xxxx day-mounth-year)
 *         default: 30-09-2021
 *     responses:
 *       200:
 *         description: The Number of covid cases
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 */

app.get('/compare/:country1/:country2/:date1/:date2', async (req, res) => {
    const countries =[req.params.country1, req.params.country2]
    const dates =[req.params.date1, req.params.date2]
    const result = await covidCompare(countries,dates)
    res.send(`The compare of confirmed covid 19 cases between ${countries[0]}  and ${countries[1]} by this dates ${dates[0]} - ${dates[1]} is: ${JSON.stringify(result)}`)
})

/**
 * @swagger
 * /deaths/{countries}/{dates}:
 *   get:
 *     summary: Returns The deaths covid 19 by country
 *     tags: [Covid19]
 *     parameters:
 *       - in: path
 *         name: countries
 *         schema:
 *           type: object
 *         required: true
 *         default: {"countries":['Israel','France','Italy']}
 *         description: The countries you want to compare
 *       - in: path
 *         name: dates
 *         schema:
 *           type: object
 *         required: true
 *         default: {"dates":['20-09-2021','30-09-2021']}
 *         description: The Dates you want to compare
 *     responses:
 *       200:
 *         description: The Number of covid cases
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 */

app.get('/deaths/:countries/:dates', async (req, res) => {

    const countries = await JSON.parse(req.params.countries)
    const dates = await JSON.parse(req.params.dates)
    const result = await covidDeaths(countries.countries,dates.dates)
    res.send(`The compare of confirmed covid 19 deaths by this dates ${dates[0]} - ${dates[1]} each day are: ${JSON.stringify(result)}`)
})


app.listen(port, () => {
    console.log(`Server is up in - http://localhost:${port}`)
})

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
