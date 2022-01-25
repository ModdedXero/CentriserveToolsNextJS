# CentriserveToolsNextJS

This is a collection of tools used for tasks at Centriserve IT. Written
and maintained by Blake Prejean.

The application is Written with NextJS and MongoDB. REST API is managed
by NextJS using Express.

`npm run test:e2e` runs tests for the program and verifies API.

# REST API

The REST API to the program is described below.

## Get list of sites

### Request

`GET /api/sites`

    fetch(https://localhost:3000/api/sites);

### Response

    HTTP/1.1 200 OK
    Date: Thu, 24 Feb 2011 12:36:30 GMT
    Status: 200 OK
    Connection: close
    Content-Type: application/json
    Content-Length: 2

    []

## Get list of devices

### Request

`GET /api/devices/{site}`

    fetch(https://localhost:3000/api/devices/:site);

### Response

    HTTP/1.1 200 OK
    Date: Thu, 24 Feb 2011 12:36:30 GMT
    Status: 200 OK
    Connection: close
    Content-Type: application/json
    Content-Length: 2

    []