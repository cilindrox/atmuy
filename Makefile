
test:
	@NODE_ENV=test NODE_TLS_REJECT_UNAUTHORIZED=0 ./node_modules/.bin/mocha

compile:
	./node_modules/.bin/gulp

test-server:
	@node test/server

clean:
	./node_modules/.bin/gulp clean

.PHONY: test
