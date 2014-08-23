
MOCHA=node_modules/mocha/bin/_mocha
ISTANBUL=node_modules/istanbul/lib/cli.js
COVERAGE_REPORT=coverage/lcov.info
COVERALLS = node_modules/coveralls/bin/coveralls.js

test:
	@NODE_TLS_REJECT_UNAUTHORIZED=0 \
		$(MOCHA)

test-cov:
	@$(ISTANBUL) cover $(MOCHA) -- \
		--reporter dot

run:
	@NODE_ENV='production' \
		npm start

dev:
	@NODE_ENV='development' \
		npm start

start-db:
	@mongod --dbpath './data'&

clean:
	@rm -rf ./coverage

coveralls:
	cat $(COVERAGE_REPORT) | $(COVERALLS) \
		&& make clean

.PHONY: test test-cov run dev clean start-db
