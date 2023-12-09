package structs

import ()

// Used to perform the unmarsalling of the entire config.yml file where all specific database configuration is defined
type VtrainConfig struct {
	PlanConfig map[string]NestedVtrainConfig `yaml:"planConfig"`
}

// Used to represent the training plan specific configuration defined in the config.yml configuration file for each week
type NestedVtrainConfig struct {
	C142 string `yaml:"c1-42"`
	C242 string `yaml:"c2-42"`
	C121 string `yaml:"c1-21"`
	C221 string `yaml:"c2-21"`
	KM42 string `yaml:"km-42"`
	KM21 string `yaml:"km-21"`
}

// It represents a vtrain week
type vtrain struct {
	Sunday    string
	Monday    string
	Tuesday   string
	Wednesday string
	Thursday  string
	Friday    string
	Saturday  string
}
