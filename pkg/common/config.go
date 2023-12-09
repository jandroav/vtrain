package common

import (
	_ "embed"
	"fmt"
	"os"

	"github.com/TwiN/go-color"
	"github.com/jandroav/vtrain/pkg/structs"
	"gopkg.in/yaml.v3"
)

//go:embed config.yaml
var yamlConfig []byte

func LoadConfig() structs.VtrainConfig {
	var vtrainConfig structs.VtrainConfig

	err := yaml.Unmarshal(yamlConfig, &vtrainConfig)
	if err != nil {
		fmt.Println(color.Colorize(color.Red, "Error cargando la configuración: "+err.Error()))
		os.Exit(1)
	}
	return vtrainConfig
}
