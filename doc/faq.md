# :question: FAQ

## :grey_question: How can I spin up a database?

You have two alternatives:

### Configuration file

1. Manually create a `databases.yaml` file or just execute `vtrain init` to get a sample one with all available databases
2. Add the following configuration block

    ```yaml
    db:
    - mongo:
        dbname: races
        externalport: 7453
        version: 6.0.2
    ```

3. Run `vtrain db create`

### Command line arguments
`vtrain db create --name myDb --type mongo --version 6.0.2 --port 5557` or `vtrain db create -n myDb -t mongo -v 6.0.2 -o 5557`


## :grey_question: How can I delete a local database?

`vtrain db delete -i myDb` or `vtrain db delete --instance myDb`

## :grey_question: How can I delete all databases?

`vtrain db delete -a` or `vtrain db delete --all`

## :grey_question: How can I delete a cloud database?

1. Remove its configuration block from the `databases.yaml` file
2. Run `vtrain db update`

## :grey_question: How can I use my pro license key?

It can be defined globally in the `databases.yaml` config file as:

```yaml
db:
  - postgres:
      dbname: cars
      externalport: 7452
      version: 12.12
jandroav:
  pro: ABwwGgQUasdasdasdasdasdasdasd
```

Also it can be defined as command line flag when creating a database:

`vtrain db create -n myDb -t mongo -v 6.0.2 -o 5557 --pro ABwwGgQUasdasdasdasdasdasdasd` or `vtrain db create -n myDb -t mongo -v 6.0.2 -o 5557 -p ABwwGgQUasdasdasdasdasdasdasd`