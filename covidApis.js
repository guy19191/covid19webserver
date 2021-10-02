const axios = require('axios')
const https = require('https')

const protocol = process.env.PROTOCOL || 'https://'
const url = process.env.API || 'covid-api.mmediagroup.fr/v1'
const agent = new https.Agent({
        rejectUnauthorized: false
    })
const months = {
    'Jan' : '01',
    'Feb' : '02',
    'Mar' : '03',
    'Apr' : '04',
    'May' : '05',
    'Jun' : '06',
    'Jul' : '07',
    'Aug' : '08',
    'Sep' : '09',
    'Oct' : '10',
    'Nov' : '11',
    'Dec' : '12'
}
const apiUrl = protocol + url

async function getCovidInfoHistory (county,date,status='confirmed',returnedDate=true){
    try {
        const result = await axios.get(apiUrl + '/history?country=' + county + '&status='+status, {
            httpsAgent: agent,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': '*'
            }})
        const data = result.data.All.dates
        if (returnedDate) {
            date = date.slice(6, 10) + '-' + date.slice(3, 5) + '-' + date.slice(0, 2)
            for (let i in data) {
                if (i == date) {
                    return {status: 200, data: data[i]}
                }
            }
            return {status: 500, data: 'No date found'}
        }
        else{
            return {status: 200, data: data}
        }

    }
    catch (e) {
        return {status:e.response.status,data:'Error in API'}
    }
}

async function getCovidInfoToday (county){
    if (county!=undefined) {
        try {
            const result = await axios.get(apiUrl + '/cases?country=' + county, {
                httpsAgent: agent,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': '*'
                }
            })
            if (result.data.All!=undefined) {
                return {status: 200, data: result.data.All.confirmed}
            }
            else {
                return {status: 500, data: 'Could not find country'}
            }
        } catch (e) {
            return {status: e.response.status, data: 'Error in API'}
        }
    }
    else {
        return {status: 500, data: 'No country sent'}
    }
}

async function covidCompare(countries, dates){

    let i = dates[0].slice(6,10)+ '-' +  dates[0].slice(3,5) + '-' + dates[0].slice(0,2)
    const until = await addDay(dates[1].slice(6,10)+ '-' +  dates[1].slice(3,5) + '-' + dates[1].slice(0,2))
    let compareTable = []
    const prec1 = await getCovidInfoHistory(countries[0],i,'confirmed',false)
    const prec2 = await getCovidInfoHistory(countries[1],i,'confirmed',false)
    while (i!=until){
        const percentage = Number(prec1.data[i]) / Number(prec2.data[i])
        compareTable.push({[i]: String(percentage)})
        i = await addDay(i)
    }
    return compareTable
}

async function covidDeaths(countries, dates){
    const until = await addDay(dates[1].slice(6,10)+ '-' +  dates[1].slice(3,5) + '-' + dates[1].slice(0,2))
    let result = {}
    for(let j in countries){
        let i = dates[0].slice(6,10)+ '-' +  dates[0].slice(3,5) + '-' + dates[0].slice(0,2)
        let compareTable = []
        const prec = await getCovidInfoHistory(countries[0],i,'deaths',false)
        while(i != until){
            const count = Number(prec.data[await addDay(i)]) - Number(prec.data[i])
            compareTable.push({[i] : String(count)})
         i = await addDay(i)
        }
        result[countries[j]] = compareTable
    }
    return result
}

async function addDay(date) {

    const newDate = date.slice(0,4) + '/' +date.slice(5,7) + '/' + date.slice(8,10)
    let result = new Date(newDate)
    result.setDate(result.getDate() + 1)
    let resultString = String(result)
    return resultString.slice(11,15)+ '-' +  months[resultString.slice(4,7)] + '-' + resultString.slice(8,10)
}

module.exports = {getCovidInfoToday,getCovidInfoHistory,covidCompare,covidDeaths}
