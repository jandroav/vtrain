package plan

import (
	"fmt"
	"strconv"
	"time"

	"github.com/TwiN/go-color"
	"github.com/jandroav/vtrain/pkg/structs"
)

var halfMarathonVDOT = map[int]string{
	30: "2:21:04", 31: "2:17:21", 32: "2:13:49", 33: "2:10:27", 34: "2:07:16",
	35: "2:04:13", 36: "2:01:19", 37: "1:58:34", 38: "1:55:55", 39: "1:53:24",
	40: "1:50:59", 41: "1:48:40", 42: "1:46:27", 43: "1:44:20", 44: "1:42:17",
	45: "1:40:20", 46: "1:38:27", 47: "1:36:38", 48: "1:34:53", 49: "1:33:12",
	50: "1:31:35", 51: "1:30:02", 52: "1:28:31", 53: "1:27:04", 54: "1:25:40",
	55: "1:24:18", 56: "1:23:00", 57: "1:21:43", 58: "1:20:30", 59: "1:19:18",
	60: "1:18:09", 61: "1:17:02", 62: "1:15:57", 63: "1:14:54", 64: "1:13:53",
	65: "1:12:53", 66: "1:11:56", 67: "1:11:00", 68: "1:10:05", 69: "1:09:12",
	70: "1:08:21",
}

var marathonVDOT = map[int]string{
	30: "4:49:17", 31: "4:41:57", 32: "4:34:59", 33: "4:28:22", 34: "4:22:03",
	35: "4:16:03", 36: "4:10:19", 37: "4:04:50", 38: "3:59:35", 39: "3:54:34",
	40: "3:49:45", 41: "3:45:09", 42: "3:40:43", 43: "3:36:28", 44: "3:32:23",
	45: "3:28:26", 46: "3:24:39", 47: "3:21:00", 48: "3:17:29", 49: "3:14:06",
	50: "3:10:49", 51: "3:07:39", 52: "3:04:36", 53: "3:01:39", 54: "2:58:47",
	55: "2:56:01", 56: "2:53:20", 57: "2:50:45", 58: "2:48:14", 59: "2:45:47",
	60: "2:43:25", 61: "2:41:08", 62: "2:38:54", 63: "2:36:44", 64: "2:34:38",
	65: "2:32:35", 66: "2:30:36", 67: "2:28:40", 68: "2:26:47", 69: "2:24:57",
	70: "2:23:10",
}

var sPaces = map[int]string{
	30: "7:27 - 8:14", 31: "7:16 - 8:02", 32: "7:05 - 7:52", 33: "6:55 - 7:41", 34: "6:45 - 7:31",
	35: "6:36 - 7:21", 36: "6:27 - 7:11", 37: "6:19 - 7:02", 38: "6:11 - 6:54", 39: "6:03 - 6:46",
	40: "5:56 - 6:38", 41: "5:49 - 6:31", 42: "5:42 - 6:23", 43: "5:35 - 6:16", 44: "5:29 - 6:10",
	45: "5:23 - 6:03", 46: "5:17 - 5:57", 47: "5:12 - 5:51", 48: "5:07 - 5:45", 49: "5:01 - 5:40",
	50: "4:56 - 5:34", 51: "4:52 - 5:29", 52: "4:47 - 5:24", 53: "4:43 - 5:19", 54: "4:38 - 5:14",
	55: "4:34 - 5:10", 56: "4:30 - 5:05", 57: "4:26 - 5:01", 58: "4:22 - 4:57", 59: "4:19 - 4:53",
	60: "4:15 - 4:49", 61: "4:11 - 4:45", 62: "4:08 - 4:41", 63: "4:05 - 4:38", 64: "4:02 - 4:34",
	65: "3:59 - 4:31", 66: "3:56 - 4:28", 67: "3:53 - 4:24", 68: "3:50 - 4:21", 69: "3:47 - 4:18",
	70: "3:44 - 4:15", 71: "3:42 - 4:12", 72: "3:40 - 4:00", 73: "3:37 - 4:07", 74: "3:34 - 4:04",
	75: "3:32 - 4:01", 76: "3:30 - 3:58", 77: "3:28 - 3:56", 78: "3:25 - 3:53", 79: "3:23 - 3:51",
}

var mPaces = map[int]string{
	30: "7:03", 31: "6:52", 32: "6:40", 33: "6:30", 34: "6:20",
	35: "6:10", 36: "6:01", 37: "5:53", 38: "5:45", 39: "5:37",
	40: "5:29", 41: "5:22", 42: "5:16", 43: "5:09", 44: "5:03",
	45: "4:57", 46: "4:51", 47: "4:46", 48: "4:41", 49: "4:36",
	50: "4:31", 51: "4:27", 52: "4:22", 53: "4:18", 54: "4:14",
	55: "4:10", 56: "4:06", 57: "4:03", 58: "3:59", 59: "3:56",
	60: "3:52", 61: "3:49", 62: "3:46", 63: "3:43", 64: "3:40",
	65: "3:37", 66: "3:34", 67: "3:31", 68: "3:29", 69: "3:26",
	70: "3:24", 71: "3:21", 72: "3:19", 73: "3:17", 74: "3:14",
	75: "3:12", 76: "3:10", 77: "3:08", 78: "3:06", 79: "3:03",
}

var uPaces = map[int]string{
	30: "6:24", 31: "6:14", 32: "6:05", 33: "5:56", 34: "5:48",
	35: "5:40", 36: "5:33", 37: "5:26", 38: "5:19", 39: "5:12",
	40: "5:06", 41: "5:00", 42: "4:54", 43: "4:49", 44: "4:43",
	45: "4:38", 46: "4:33", 47: "4:29", 48: "4:24", 49: "4:20",
	50: "4:15", 51: "4:11", 52: "4:07", 53: "4:04", 54: "4:00",
	55: "3:56", 56: "3:53", 57: "3:50", 58: "3:46", 59: "3:43",
	60: "3:40", 61: "3:37", 62: "3:34", 63: "3:32", 64: "3:29",
	65: "3:26", 66: "3:24", 67: "3:21", 68: "3:19", 69: "3:16",
	70: "3:14", 71: "3:12", 72: "3:10", 73: "3:08", 74: "3:06",
	75: "3:04", 76: "3:02", 77: "3:00", 78: "2:58", 79: "2:56",
}

var iPaces = map[int]string{
	30: "5:00", 31: "5:00", 32: "5:00", 33: "5:00", 34: "5:00",
	35: "5:00", 36: "5:00", 37: "5:00", 38: "4:54", 39: "4:48",
	40: "4:42", 41: "4:36", 42: "4:31", 43: "4:26", 44: "4:21",
	45: "4:16", 46: "4:12", 47: "4:07", 48: "4:03", 49: "3:59",
	50: "3:55", 51: "3:51", 52: "3:48", 53: "3:44", 54: "3:41",
	55: "3:37", 56: "3:34", 57: "3:31", 58: "3:28", 59: "3:25",
	60: "3:23", 61: "3:20", 62: "3:17", 63: "3:15", 64: "3:12",
	65: "3:10", 66: "3:08", 67: "3:05", 68: "3:03", 69: "3:01",
	70: "2:59", 71: "2:57", 72: "2:55", 73: "2:53", 74: "2:51",
	75: "2:49", 76: "2:48", 77: "2:46", 78: "2:44", 79: "2:42",
}

var rPaces = map[int]string{
	30: "2:00", 31: "2:00", 32: "2:00", 33: "2:00", 34: "2:00",
	35: "1:57", 36: "1:54", 37: "1:51", 38: "1:48", 39: "1:46",
	40: "1:44", 41: "1:42", 42: "1:40", 43: "1:38", 44: "1:36",
	45: "1:34", 46: "1:32", 47: "1:30", 48: "1:29", 49: "1:28",
	50: "1:27", 51: "1:26", 52: "1:25", 53: "1:24", 54: "1:22",
	55: "1:21", 56: "1:20", 57: "1:19", 58: "1:17", 59: "1:16",
	60: "1:15", 61: "1:14", 62: "1:13", 63: "1:12", 64: "1:11",
	65: "1:10", 66: "1:09", 67: "1:08", 68: "1:07", 69: "1:06",
	70: "1:05", 71: "1:04", 72: "1:03", 73: "1:03", 74: "1:02",
	75: "1:01", 76: "1:00", 77: "0:59", 78: "0:59", 79: "0:58",
}

func getVDOT(targetTime string, raceDistance int) (int, error) {
	layout := "15:04:05" // Time layout for hh:mm:ss
	targetTimeParsed, err := time.Parse(layout, targetTime)
	if err != nil {
		return 0, fmt.Errorf("Error procesando tiempo objetivo: %v", err)
	}

	var vdotMap map[int]string

	switch raceDistance {
	case 21:
		vdotMap = halfMarathonVDOT
	case 42:
		vdotMap = marathonVDOT
	default:
		return 0, fmt.Errorf("Distancia no soportada: %d", raceDistance)
	}

	minDiff := time.Duration(^uint(0) >> 1) // Maximum duration
	var closestVDOT int

	for vdot, vdotTime := range vdotMap {
		vdotTimeParsed, err := time.Parse(layout, vdotTime)
		if err != nil {
			return 0, fmt.Errorf("Error procesando VDOT: %v", err)
		}

		diff := targetTimeParsed.Sub(vdotTimeParsed)
		if diff < 0 {
			diff = -diff
		}

		if diff < minDiff {
			minDiff = diff
			closestVDOT = vdot
		}
	}

	return closestVDOT, nil
}

func calculateTrainingPaces(vdot int) map[string]string {
	runningPaces := make(map[string]string)

	// Get paces from sPaces
	if pace, ok := sPaces[vdot]; ok {
		runningPaces["Suave"] = pace
	} else {
		runningPaces["Suave"] = "No disponible"
	}

	// Get paces from mPaces
	if pace, ok := mPaces[vdot]; ok {
		runningPaces["Ritmo Maraton"] = pace
	} else {
		runningPaces["Ritmo Maraton"] = "No disponible"
	}

	// Get paces from uPaces
	if pace, ok := uPaces[vdot]; ok {
		runningPaces["Umbral"] = pace
	} else {
		runningPaces["Umbral"] = "No disponible"
	}

	// Get paces from iPaces
	if pace, ok := iPaces[vdot]; ok {
		runningPaces["Interval"] = pace
	} else {
		runningPaces["Interval"] = "No disponible"
	}

	// Get paces from rPaces
	if pace, ok := rPaces[vdot]; ok {
		runningPaces["Repeticion"] = pace
	} else {
		runningPaces["Repeticion"] = "No disponible"
	}

	return runningPaces
}

// CreatePlan creates a new training plan. It receives the VtrainConfig struct, the distance and the raceDate. The training plan is a 12 week plan.
// This function calculates 12 weeks before the raceDate and then it creates a new plan based on the distance and the raceDate.
// The plan is created in the current directory.
// vtrainVtrainConfig represents the VtrainConfig struct.
// c1 and c2 are the two training sessions for each week.
// c1 has to be scheduled on Miercoles
// c2 has to be scheduled on Sabado
// Lunes, Martes, Jueves and Viernes are long runs of 15k, 10k, 15k and 10k respectively.
func CreatePlan(vtrainConfig structs.VtrainConfig, distance string, raceDate string, raceTime string) error {
	distanceInt, err := strconv.Atoi(distance)
	if err != nil {
		fmt.Println("Error procesando distancia:", err)
		return err
	}
	// Parse raceDate string into time.Time
	raceDateTime, err := time.Parse("2006-01-02", raceDate)
	if err != nil {
		fmt.Println("Error procesando fecha de la carrera:", err)
		return err
	}
	// Calculate 12 weeks before the raceDate
	startDate := raceDateTime.AddDate(0, 0, -84) // 12 weeks = 84 days
	// Create a plan for each of the 12 weeks
	for week := 1; week <= 12; week++ {
		if distanceInt == 42 {
			// Generate the training sessions for the current week
			c1 := vtrainConfig.PlanConfig[fmt.Sprintf("s%d", week)].C142
			c2 := vtrainConfig.PlanConfig[fmt.Sprintf("s%d", week)].C242
			km42 := vtrainConfig.PlanConfig[fmt.Sprintf("s%d", week)].KM42

			// Calculate the scheduled dates for c1 and c2
			c1Date := startDate.AddDate(0, 0, (week-1)*7+3) // Miercoles
			c2Date := startDate.AddDate(0, 0, (week-1)*7+6) // Sabado

			// Print or save the training sessions and scheduled dates
			fmt.Println(color.Colorize(color.Yellow, "\nSemana "+strconv.Itoa(week)))
			if week != 12 {
				fmt.Printf("\tLunes\t\t(%s): 20S\n", startDate.AddDate(0, 0, (week-1)*7+1).Format("2006-01-02"))
			} else {
				fmt.Printf("\tLunes\t\t(%s): 10S\n", startDate.AddDate(0, 0, (week-1)*7+1).Format("2006-01-02"))
			}
			if week != 12 {
				fmt.Printf("\tMartes\t\t(%s): 20S\n", startDate.AddDate(0, 0, (week-1)*7+2).Format("2006-01-02"))
			} else {
				fmt.Printf("\tMarte\t\t(%s): 10S\n", startDate.AddDate(0, 0, (week-1)*7+2).Format("2006-01-02"))
			}
			fmt.Println(color.Colorize(color.Red, "\tMiércoles\t("+c1Date.Format("2006-01-02")+"): "+c1))
			if week != 12 {
				fmt.Printf("\tJueves\t\t(%s): 20S\n", startDate.AddDate(0, 0, (week-1)*7+4).Format("2006-01-02"))
			} else {
				fmt.Printf("\tJueves\t\t(%s): 10S\n", startDate.AddDate(0, 0, (week-1)*7+4).Format("2006-01-02"))
			}
			if week != 12 {
				fmt.Printf("\tViernes\t\t(%s): 20S\n", startDate.AddDate(0, 0, (week-1)*7+5).Format("2006-01-02"))
			} else {
				fmt.Println(color.Colorize(color.Blue, "\tViernes\t\t("+startDate.AddDate(0, 0, (week-1)*7+5).Format("2006-01-02")+"): "+"Descanso"))
			}
			fmt.Println(color.Colorize(color.Red, "\tSábado\t\t("+c2Date.Format("2006-01-02")+"): "+c2))
			if week != 12 {
				fmt.Printf("\tDomingo\t\t(%s): 20S\n", startDate.AddDate(0, 0, (week-1)*7+7).Format("2006-01-02"))
			} else {
				fmt.Printf("\tDomingo\t\t(%s): Día de la carrera!!\n", startDate.AddDate(0, 0, (week-1)*7+7).Format("2006-01-02"))
			}
			fmt.Printf("\tKms: %s\n", km42)
			printPaces(distance, raceTime)
		}
		if distanceInt == 21 {
			// Generate the training sessions for the current week
			c1 := vtrainConfig.PlanConfig[fmt.Sprintf("s%d", week)].C121
			c2 := vtrainConfig.PlanConfig[fmt.Sprintf("s%d", week)].C221
			km21 := vtrainConfig.PlanConfig[fmt.Sprintf("s%d", week)].KM21

			// Calculate the scheduled dates for c1 and c2
			c1Date := startDate.AddDate(0, 0, (week-1)*7+3) // Miercoles
			c2Date := startDate.AddDate(0, 0, (week-1)*7+6) // Sabado

			// Print or save the training sessions and scheduled dates
			fmt.Println(color.Colorize(color.Yellow, "\nSemana "+strconv.Itoa(week)))
			if week != 12 {
				fmt.Printf("\tLunes\t\t(%s): 10S\n", startDate.AddDate(0, 0, (week-1)*7+1).Format("2006-01-02"))
			} else {
				fmt.Printf("\tLunes\t\t(%s): 7S\n", startDate.AddDate(0, 0, (week-1)*7+1).Format("2006-01-02"))
			}
			if week != 12 {
				fmt.Printf("\tMartes\t\t(%s): 10S\n", startDate.AddDate(0, 0, (week-1)*7+2).Format("2006-01-02"))
			} else {
				fmt.Printf("\tMartes\t\t(%s): 7S\n", startDate.AddDate(0, 0, (week-1)*7+2).Format("2006-01-02"))
			}
			fmt.Println(color.Colorize(color.Red, "\tMiércoles\t("+c1Date.Format("2006-01-02")+"): "+c1))
			if week != 12 {
				fmt.Println(color.Colorize(color.Blue, "\tJueves\t\t("+startDate.AddDate(0, 0, (week-1)*7+4).Format("2006-01-02")+"): "+"Descanso"))
			} else {
				fmt.Println(color.Colorize(color.Blue, "\tJueves\t\t("+startDate.AddDate(0, 0, (week-1)*7+4).Format("2006-01-02")+"): "+"Descanso"))
			}
			if week != 12 {
				fmt.Printf("\tViernes\t\t(%s): 10S\n", startDate.AddDate(0, 0, (week-1)*7+5).Format("2006-01-02"))
			} else {
				fmt.Println(color.Colorize(color.Blue, "\tViernes\t\t("+startDate.AddDate(0, 0, (week-1)*7+5).Format("2006-01-02")+"): "+"Descanso"))
			}
			fmt.Println(color.Colorize(color.Red, "\tSábado\t\t("+c2Date.Format("2006-01-02")+"): "+c2))
			if week != 12 {
				fmt.Printf("\tDomingo\t\t(%s): 15S\n", startDate.AddDate(0, 0, (week-1)*7+7).Format("2006-01-02"))
			} else {
				fmt.Printf("\tDomingo\t\t(%s): Día de la carrera!!\n", startDate.AddDate(0, 0, (week-1)*7+7).Format("2006-01-02"))
			}
			fmt.Printf("\tKms: %s\n", km21)
			printPaces(distance, raceTime)
		}
	}
	return nil
}

func printPaces(distance string, raceTime string) {

	distanceInt, err := strconv.Atoi(distance)
	if err != nil {
		fmt.Println("Error:", err)
		return
	}
	vdot, err := getVDOT(raceTime, distanceInt)
	if err != nil {
		fmt.Println("Error:", err)
		return
	}

	runningPaces := calculateTrainingPaces(vdot)
	fmt.Println(color.Colorize(color.Green, "\nVDOT: "+strconv.Itoa(vdot)))
	fmt.Println(color.Colorize(color.Yellow, "Ritmos de entrenamiento"))
	fmt.Println(color.Colorize(color.Yellow, "Suave: "+runningPaces["Suave"]))
	fmt.Println(color.Colorize(color.Yellow, "Ritmo Maratón: "+runningPaces["Ritmo Maraton"]))
	fmt.Println(color.Colorize(color.Yellow, "Umbral: "+runningPaces["Umbral"]))
	fmt.Println(color.Colorize(color.Yellow, "Intervalo: "+runningPaces["Interval"]))
	fmt.Println(color.Colorize(color.Yellow, "Repetición (Ritmo 400m): "+runningPaces["Repeticion"]))
}


