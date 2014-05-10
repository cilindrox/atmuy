atmuy
=====

Proyecto de ubicación de ATMs en Montevideo

[![Build Status](https://travis-ci.org/gfestari/atmuy.svg?branch=master)](https://travis-ci.org/gfestari/atmuy) [![Code Climate](https://codeclimate.com/github/gfestari/atmuy.png)](https://codeclimate.com/github/gfestari/atmuy) [![Dependency Status](https://gemnasium.com/gfestari/atmuy.svg)](https://gemnasium.com/gfestari/atmuy)


## Installation

1. Clone the repo and `cd` to the folder
2. Start [mongoDB] using the local `data` folder: `mongod --dbpath "$(pwd)/data"&`
2. `npm install`
3. `npm start`
4. Open your browser and point it towards [http://localhost:3333]()

### Dependencies

This project requires both MongoDB and NodeJS to run, so please make sure you have setup both properly on your system.

We recommend having an instance of mongo running prior to starting the app. Likewise, it is advisable to use the local `data` folder as a DB dump.

## Contributing

1. Fork the repo
2. `make test`
3. *hack, hack, hack*
4. Create a pull request with your changes

For more details, take a look at [CONTRIBUTING].

## License

Apache 2.0

[mongoDB]: http://www.mongodb.org/downloads
