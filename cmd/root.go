package cmd

import (
	"os"

	cc "github.com/ivanpirog/coloredcobra"
	"github.com/jandroav/vtrain/cmd/plan"
	pc "github.com/jandroav/vtrain/pkg/common"
	"github.com/spf13/cobra"
)

// rootCmd represents the base command when called without any subcommands
var rootCmd = &cobra.Command{
	Use:   "vtrain",
	Short: pc.VtrainShortDesc,
	Long: pc.VtrainLogo + `
vtrain Version: ` + pc.VtrainVersion + ` by jandroav

Planes de entrenamiento basados en VDOT de Jack Daniels.

Documentación disponible en:
https://github.com/jandroav/vtrain`,
	Version: pc.VtrainVersion,
}

// Execute adds all child commands to the root command and sets flags appropriately.
// This is called by main.main(). It only needs to happen once to the rootCmd.
func Execute() {
	cc.Init(&cc.Config{
		RootCmd:       rootCmd,
		Headings:      cc.HiCyan + cc.Bold + cc.Underline,
		Commands:      cc.HiYellow + cc.Bold,
		Aliases:       cc.HiGreen + cc.Bold + cc.Italic,
		CmdShortDescr: cc.HiGreen,
		Example:       cc.HiGreen + cc.Italic,
		ExecName:      cc.HiBlue + cc.Bold,
		Flags:         cc.HiMagenta + cc.Bold,
		FlagsDescr:    cc.HiGreen,
		FlagsDataType: cc.Italic,
	})

	err := rootCmd.Execute()
	if err != nil {
		os.Exit(1)
	}
}

func addSubCommands() {
	rootCmd.AddCommand(plan.PlanCmd)
}

func init() {
	// Cobra also supports local flags, which will only run
	// when this action is called directly.
	versionTemplate := `{{printf "%s: %s - version %s\n" .Name .Short .Version}}`
	rootCmd.SetVersionTemplate(versionTemplate)
	addSubCommands()
}
