
 <p align="center">Covid 19 API in Swagger <a href="http://nodejs.org" target="blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">


## Installation

```bash
docker build -t <Project Name>
```
```bash
docker run -d -p 8080:8080 <Project Name>
```

## Quick Start

http://127.0.0.1:8080/api-docs

APIS:
- `/daily/{country}` Gets the daily covid19 states of the country
- `/byDate/{country}/{date}` Gets the covid19 states of the country by date
- `/compare/{country1}/{country2}/{date1}/{date2}` compare in presentage the cases of both countries
- `/deaths/{counties}/{dates}` Gets the daily covid19 states of the country
