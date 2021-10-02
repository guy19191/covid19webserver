module.exports =
  {swaggerDefinition: {
  info: {
    version: "1.0.0",
    title: "Covid 19 API",
    description: "Covid 19 API Information",
    contact: {
      name: "Guy Manor"
    },
    servers: [
        "http://localhost:5000"
    ]
  }
},
apis: [
    "app.js"
]
}