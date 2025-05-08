namespace=elialgranti
serviceName=hw1
buildVersion=0.0.1

imageName=$(namespace)/$(serviceName):$(buildVersion)

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

build: ## Build deployable docker image(s) based on current project version number
	git archive HEAD --format=tar.gz --output=codebase.tar.gz
	docker build . --target=deployable -t '$(imageName)'
	@echo 'Built: $(imageName)'

run: ## Run the program using docker
	docker run --rm $(imageName)

clean:
	npm run clean
	docker rmi $(imageName)

.PHONY: build run help