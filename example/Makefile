
stop:
	@-./forever/init.d/example-http stop

start:
	@./forever/init.d/example-http start

restart: stop start

start-dev:
	@./forever/init.d/example-http start ./forever/dev/http.conf

restart-dev: stop start-dev

.PHONY: stop start restart start-dev restart-dev
