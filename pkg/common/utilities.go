package common

import (
	"github.com/jandroav/vtrain/pkg/structs"
	"time"
)

// Some common constants like the logo to be used in the long description of the commands
const (
	VtrainVersion   = "0.0.1"
	VtrainShortDesc = "Planes de entrenamiento basados en VDOT de Jack Daniels"
	VtrainLogo      = `
	__    __   ________   ______       ____      _____      __      _ 
	) )  ( (  (___  ___) (   __ \     (    )    (_   _)    /  \    / )
       ( (    ) )     ) )     ) (__) )    / /\ \      | |     / /\ \  / / 
	\ \  / /     ( (     (    __/    ( (__) )     | |     ) ) ) ) ) ) 
	 \ \/ /       ) )     ) \ \  _    )    (      | |    ( ( ( ( ( (  
	  \  /       ( (     ( ( \ \_))  /  /\  \    _| |__  / /  \ \/ /  
	   \/        /__\     )_) \__/  /__(  )__\  /_____( (_/    \__/   
`
)

func GetPlanDefaultValues() structs.VtrainConfig {
	return LoadConfig()
}

// check if raceDate format is YYYY-MM-DD
func IsValidDate(raceDate string) bool {
	// Define the expected date format
	expectedFormat := "2006-01-02"
	// Parse the input date string
	_, err := time.Parse(expectedFormat, raceDate)
	// Check if there was no error during parsing
	return err == nil
}

func IsValidTime(input string) bool {
	// Define the expected time format
	expectedFormat := "15:04:05"

	// Try to parse the input string
	_, err := time.Parse(expectedFormat, input)

	// If there is no error, the time format is valid
	return err == nil
}

// ConvertStringToSeconds converts a string representing a time duration to seconds.
func ConvertTimeToSeconds(timeString string) (float64, error) {
	parsedTime, err := time.Parse("15:04:05", timeString)
	if err != nil {
		return 0, err
	}

	// Calculate total seconds
	seconds := parsedTime.Hour()*3600 + parsedTime.Minute()*60 + parsedTime.Second()

	return float64(seconds), nil
}
