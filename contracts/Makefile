SHELL := /bin/bash

# Thor solo
solo-up: #@ Start Thor solo
	docker-compose up -d
solo-down: #@ Stop Thor solo
	docker-compose down

# Compilation
compile: #@ Compile contracts
	npm run compile

# Testing
test: #@ Run tests on hardhat
	npm run test
test:solo: #@ Run tests on vechain solo
	npm run test:solo

# Deployment
deploy:simple: #@ Deploy simple contract to hardhat
	npm run deploy:simple
deploy:simple:solo: #@ Deploy simple contract to vechain solo
	npm run deploy:simple:solo
deploy:simple:testnet: #@ Deploy simple contract to vechain testnet
	npm run deploy:simple:testnet

# Clean
clean: #@ Clean build artifacts
	npm run clean

# Help
help: #@ Show this help
	@echo "Available commands:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?#@.*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?#@ "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'