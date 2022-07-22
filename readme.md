## Set up for dev environment

```shell
# start databases with docker
docker-compose -f ./db-docker-compose.yaml up -d
# apis
# run `go install github.com/cosmtrek/air@latest` if air not installed
air
# ui
cd ./web && tyarn dev

# shut down databases
docker-compose -f ./db-docker-compose.yaml down
```
