/*
Copyright © 2022 NAME HERE <EMAIL ADDRESS>
*/
package plan

import (
	"fmt"

	"github.com/TwiN/go-color"
	cm "github.com/jandroav/vtrain/pkg/common"
	pl "github.com/jandroav/vtrain/pkg/plan"
	"github.com/jandroav/vtrain/pkg/structs"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

var distance string
var raceDate string
var raceTime string

// PlanCmd represents the create command
var PlanCmd = &cobra.Command{
	Use:    "plan",
	Args:   cobra.NoArgs,
	Short:  "Crea un nuevo plan de entrenamiento",
	PreRun: cm.ToggleDebug,
	Long: cm.VtrainLogo + `
Crea un nuevo plan de entrenamiento`,
	Run: func(cmd *cobra.Command, args []string) {

		var VdotConfig structs.VtrainConfig
		VdotConfig = cm.GetPlanDefaultValues()

		if err := viper.Unmarshal(&VdotConfig); err != nil {
			fmt.Println(color.Colorize(color.Red, err.Error()))
			return
		}

		// check if raceDate format is YYYY-MM-DD and if distance is 21k or 42k
		if cm.IsValidDate(raceDate) {
			if cm.IsValidTime(raceTime) {
				if distance != "21" && distance != "42" {
					fmt.Println(color.Colorize(color.Red, "Distancia inválida. Debe ser 21 o 42"))
					return
				}
				err := pl.CreatePlan(VdotConfig, distance, raceDate, raceTime)
				if err != nil {
					fmt.Println(color.Colorize(color.Red, err.Error()))
					return
				}
			} else {
				fmt.Println(color.Colorize(color.Red, "Formato de tiempo objetivo inválido. Debe ser hh:mm:ss"))
				return
			}
		} else {
			fmt.Println(color.Colorize(color.Red, "Formato de fecha de carrera inválido. Debe ser YYYY-MM-DD"))
			return
		}
	},
}

func init() {
	// distance and raceDate are required flags
	PlanCmd.Flags().StringVarP(&distance, "distancia", "d", "", "Distancia objetivo (21 o 42)")
	PlanCmd.MarkFlagRequired("distancia")
	PlanCmd.Flags().StringVarP(&raceDate, "fechaCarrera", "f", "", "Fecha de la carrera (YYYY-MM-DD)")
	PlanCmd.MarkFlagRequired("fechaCarrera")
	PlanCmd.Flags().StringVarP(&raceTime, "tiempoObjetivo", "t", "", "Tiempo objetivo (hh:mm:ss)")
	PlanCmd.MarkFlagRequired("tiempoObjetivo")
	PlanCmd.MarkFlagsRequiredTogether("distancia", "fechaCarrera", "tiempoObjetivo")
}
