# :hammer_and_wrench: Development

## :stop_sign: Before you begin writing code
### Local databases (Docker)
Almost every used concept is related to the [cobra](https://github.com/spf13/cobra) and [viper](https://github.com/spf13/viper) frameworks. Please watch the following great YouTube videos. After that, you will have a solid understanding about whats going on with `vtrain` :monkey_face:

* [How to write beautiful Golang CLI](https://www.youtube.com/watch?v=SSRIn5DAmyw)
* [Amazing Golang configuration with Viper](https://www.youtube.com/watch?v=IP1VXYpO4B8)

## :rocket: Run vtrain

1. Clone this repository:
    ```bash
    git clone https://github.com/jandroav/vtrain
    ```

2. Download dependencies:
    ```go
    go get
    ```

3. Install the vtrain CLI:
    ```go
    go install
    ```

3. To test, you can execute vtrain:
    ```bash
    vtrain
    ```

    You should see something like:

    ```bash
	__    __   ________   ______       ____      _____      __      _
	) )  ( (  (___  ___) (   __ \     (    )    (_   _)    /  \    / )
       ( (    ) )     ) )     ) (__) )    / /\ \      | |     / /\ \  / /
	\ \  / /     ( (     (    __/    ( (__) )     | |     ) ) ) ) ) )
	 \ \/ /       ) )     ) \ \  _    )    (      | |    ( ( ( ( ( (
	  \  /       ( (     ( ( \ \_))  /  /\  \    _| |__  / /  \ \/ /
	   \/        /__\     )_) \__/  /__(  )__\  /_____( (_/    \__/

    vtrain Version: 0.0.1 by jandroav

    Planes de entrenamiento basados en VDOT de Jack Daniels.

    Documentación disponible en:
    https://github.com/jandroav/vtrain


    Usage:

    vtrain [command]


    Available Commands:

    completion   Generate the autocompletion script for the specified shell
    help         Help about any command
    plan         Crea un nuevo plan de entrenamiento


    Flags:

    -h, --help      help for vtrain
    -v, --version   version for vtrain


    Use "vtrain [command] --help" for more information about a command.

    ```

You can also run it as `go run main.go`. The `run` command will build the cli and execute the `vtrain` entrypoint.
## :computer: Development environment

There are several alternatives you can use, but the recommended all-in-one IDE is [Visual Studio Code](https://code.visualstudio.com) with the following extensions:

* [Go](https://marketplace.visualstudio.com/items?itemName=golang.Go)

### Not needed but recommeded extensions

* [Auto Close Tag](https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-close-tag)
* [Auto Rename Tag](https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-rename-tag)
* [GitHub Copilot](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot)
* [GitLens — Git supercharged](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens)
* [IntelliCode](https://marketplace.visualstudio.com/items?itemName=VisualStudioExptTeam.vscodeintellicode)
* [Markdown All in One](https://marketplace.visualstudio.com/items?itemName=yzhang.markdown-all-in-one)
* [markdownlint](https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint)
* [Output Colorizer](https://marketplace.visualstudio.com/items?itemName=IBM.output-colorizer)
* [Path Intellisense](https://marketplace.visualstudio.com/items?itemName=christian-kohler.path-intellisense)
* [YAML](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml)
## :bricks: Project structure
Following Golang and Cobra conventions, the project is structured as follows:

* **cmd**: Where commands live. It has multiple folders (packages) grouping functionalities. For example the `db` package contains the `db` command and `create`, `list` and `delete` subcommands.
* **doc**: Repository documentation
* **pkg**: Where the logic lives. Commands should perform calls and obtain data from fields and functions placed here. Subfolders here match the organization under `cmd`.
* **test**: Where test magic happens. Grouped by the same structure as `cmd` folder.
* `main.go`: vtrain entrypoint.

![](/doc/img/project_tree.png)

## :heavy_plus_sign: Adding new commands

### Get the `cobra` CLI
First, you need to have `cobra-cli` installed. Open your terminal in the vtrain root folder and execute:

```bash
go install github.com/spf13/cobra-cli@latest
```
Test the installation:

```bash
cobra-cli --help
```

You should see the `cobra-cli` help menu.

### Create the command/subcommand

Run `cobra-cli add clean -p db` if you want to create the subcommand `clean` for the existing `db` command, or run `cobra-cli add ec2` if you want to create a new command under the root command `vtrain`.

Running `cobra-cli add ec2`, a new `go` file is created under the `cmd` package. You need to place it inside the correct folder/package. In this example, we will create the `ec2` package and move the newly created `ec2.go` file to the `ec2` directory:

![](/doc/img/ec2.png)

After moving the file, you will see some errors. To be able to use folders/packages with `cobra` and not having all files in one single folder, we need to tweak the autogenerated code to update the package name, update the command variable, and remove the function call inside the `init` function:

![](/doc/img/ec2_mod.png)

Lastly, you only need to go to the parent command (in this case, the `rootCmd`) and add the newly created command inside the `addSubCommands` function following the `packageName.commandObjectName` naming:

```go
func addSubCommands() {
	rootCmd.AddCommand(common.CheckCmd)
	rootCmd.AddCommand(db.PlanCmd)
	rootCmd.AddCommand(ec2.Ec2Cmd)
}
```
Place the command business logic under `pkg/ec2`.

After building and running vtrain, you will see the new command available:

```bash
go install && vtrain
```

![](/doc/img/ec2_vtrain.png)

(Colored command output is provided by [Colored Cobra](https://github.com/ivanpirog/coloredcobra))

## Sample command flow and interactions

![](/doc/img/command_flow.png)
## :scroll: Logging in vtrain

The logging framework used is [logrus](https://github.com/sirupsen/logrus). You can find its configuration under `pkg/common/logging.go`, and you just need to use it as:

Add `PreRun: common.ToggleDebug` in the command you want to add logging capabilities:

```go
var ToolsCmd = &cobra.Command{
	Use:   "tools",
	Short: "A brief description of your command",
	Long: `A longer description that spans multiple lines and likely contains examples
and usage of using your command. For example:

Cobra is a CLI library for Go that empowers applications.
This application is a tool to generate the needed files
to quickly create a Cobra application.`,
	PreRun: common.ToggleDebug,
	Run: func(cmd *cobra.Command, args []string) {
    [...]
	},
}
```

Log something:

```go
log.Debug("Checking if docker daemon is running")
```

Remember to add the import: `log "github.com/sirupsen/logrus"`:

```go
import (
	"errors"
	"fmt"
	"os/exec"

	log "github.com/sirupsen/logrus"
)
```

Run some `vtrain` command with `-d` or `--debugg` flags enabled:

```bash
vtrain check tools -d
```

```bash
Using config file: /Users/jandro/workspace/jandroav/vtrain/vtrain.yaml
INFO[0000] Debug logs enabled                           
DEBUG  [2022-10-21T11:02:46+02:00] Checking if docker is installed              
docker is installed
DEBUG  [2022-10-21T11:02:46+02:00] Checking if jandroav is installed           
jandroav is installed
DEBUG  [2022-10-21T11:02:46+02:00] Checking if pulumi is installed           
pulumi is installed
DEBUG  [2022-10-21T11:02:46+02:00] Checking if docker daemon is running         
DEBUG  [2022-10-21T11:02:46+02:00] CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES 
Docker is running
```

## :gem: Usefull commands

Formatting files:

`gofmt -l -s -w . `

Just build vtrain:

`go build`

Build and run vtrain:

`go run main.go`

## :triangular_ruler: Generating executables

Windows:

`GOOS=windows GOARCH=amd64 go build`

Linux:

`GOOS=linux GOARCH=amd64 go build`

macOS arm:

`GOOS=darwin GOARCH=arm64 go build`

macOS amd64:

`GOOS=darwin GOARCH=amd64 go build`

## :bookmark_tabs: Resources and help

### Courses

* [Go: The Complete Developer's Guide](https://jandroav.udemy.com/course/go-the-complete-developers-guide/)
### Books

* [Powerful Command-Line Applications in Go](https://www.oreilly.com/library/view/powerful-command-line-applications/9781680509311/)
### Videos

* [How to write beautiful Golang CLI](https://www.youtube.com/watch?v=SSRIn5DAmyw)
* [Amazing Golang configuration with Viper](https://www.youtube.com/watch?v=IP1VXYpO4B8)
### Tutorials

* [How to test CLI commands made with Go and Cobra](https://gianarb.it/blog/golang-mockmania-cli-command-with-cobra)
* [Leveled logs with Cobra and Logrus](https://droctothorpe.github.io/posts/2020/07/leveled-logs-with-cobra-and-logrus/)
* [Controlling the Docker Engine from Go](https://blog.tarkalabs.com/controlling-the-docker-engine-in-go-826012f9671c)
* [Setting up GitHub Actions for a Go project](https://medium.com/swlh/setting-up-github-actions-for-go-project-ea84f4ed3a40)

### Official documentation

* [Cobra](https://github.com/spf13/cobra/blob/main/user_guide.md)
* [Viper](https://github.com/spf13/viper)
* [Logrus](https://github.com/sirupsen/logrus)
* [Colored Cobra](https://github.com/ivanpirog/coloredcobra)
* [Go Pulumi Automation API](https://github.com/pulumi/automation-api-examples/tree/main/go/inline_program)