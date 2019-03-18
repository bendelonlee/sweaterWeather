# Sweater Weather

## Introduction

Welcome to Sweater Weather, a front application serving weather information. Users can search for weather by city, as well as register and save cities to their favorites.

## Production URL

http://sweater-weather-1.surge.sh/

## Initial Setup

1. Clone down. From the command line:
```
git clone git@github.com:bendelonlee/sweaterWeather.git
```
2. From the command line, run `npm install`.

3. Ensure that a backend application is running and sending requests to the address contained in the variable backendAddress. The backend application is found here: https://github.com/bendelonlee/sweater_weather

## Deploying

Be sure to run `nmp build` before deploying. Can be deployed as a static site to github pages or surge.

## Tech Stack

* [JavaScript](https://www.javascript.com/)
* [jQuery](https://jquery.com/)
* [Express](https://expressjs.com/)

## Known Issues

The index.js file needs to be broken up.

One or many forecast object classes could be extracted.

There is bug where duplicate elements relating to the current forecast appear underneath it.

There is no indication of what the precipitation percent number means.

There are more small bugs and fixes.

## How to Contribute

Send a pull request to git@github.com:bendelonlee/sweaterWeather.git

## Core Contributors

Ben Lee

## Special Thanks

Corey Westerfield (@corywest)
Dione W (@dionew)
Anna Smolentzov (@asmolentzov)
