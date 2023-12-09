package common

import (
	"fmt"

	"github.com/TwiN/go-color"
	log "github.com/sirupsen/logrus"
	"github.com/spf13/cobra"
)

var Debug bool

type PlainFormatter struct {
}

func (f *PlainFormatter) Format(entry *log.Entry) ([]byte, error) {
	return []byte(fmt.Sprintf(color.Colorize(color.Yellow, "%s\n"), entry.Message)), nil
}

// by adding this toggle in a command as PreRun: common.ToggleDebug, we can enable debug mode
func ToggleDebug(cmd *cobra.Command, args []string) {
	if Debug {
		log.Info("Debug logs enabled")
		log.SetLevel(log.DebugLevel)
		log.SetFormatter(&log.TextFormatter{
			DisableLevelTruncation: true,
			DisableColors:          false,
			ForceColors:            true,
			FullTimestamp:          true,
			PadLevelText:           true,
		})
	} else {
		plainFormatter := new(PlainFormatter)
		log.SetFormatter(plainFormatter)
	}
}
