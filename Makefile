
test:
	@NODE_ENV=test \
		NODE_TLS_REJECT_UNAUTHORIZED=0 \
		./node_modules/.bin/mocha

run:
	@NODE_ENV='production' \
		npm start

dev:
	@NODE_ENV='development' \
		npm start

start-db:
	@mongod --dbpath './data'&

clean:
	@rm -rf ./node_modules

.PHONY: test run dev clean start-db
