#  ---------------------------------------------------------
#  gcal-wrapper-api
#  ---------------------------------------------------------
#  @copyright MIT License. Copyright (c) 2019 - Trung Truong
#  
#  @file Makefile
# 
#  @description Makefile for all automation tasks, including
#  tests, setup, clean, etc.
#  ---------------------------------------------------------

clean:
	rm -r ./node_modules

setup:
	rm -r ./node_modules
	npm install

# Tests commands
test-local:
	@echo "  **********************************************************	"
	@echo "  IMPORTANT: In order for tests to run, some steps are needed	"
	@echo "  to be accomplished beforehand.	"
	@echo "    1.  Go to: https://developers.google.com/oauthplayground/	"
	@echo "    2.  Select the following scopes in Calendar API v3:	"
	@echo "        a. /auth/calendar: Read and write access to calendar	"
	@echo "        b. /auth/calendar.events:	"
	@echo "           Read and write access to events	"
	@echo "        c. /auth/calendar.settings.readonly: Read settings	"
	@echo "    3.  Click on authorize, get the following atributes	"
	@echo "        a. Authorization Code	"
	@echo "        b. Refresh Token	"
	@echo "        c. Access Token	"
	@echo "    4.  Store the attributes in .credentials.js	\n\n"

	# Individual tests
	# TEST AUTH ROUTES:
	make test-auth

test-auth:
	./node_modules/mocha/bin/mocha tests/dev/auth.js --exit

deploy:
	# Running test against production before deploying
	cd .. && git subtree push --prefix api heroku master
