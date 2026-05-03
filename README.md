# vtrain

Utility for generating 10k, half-marathon, and marathon training plans following [Jack Daniels'](https://en.wikipedia.org/wiki/Jack_Daniels_(coach)) methods ([VDOT](https://planesmaraton.com/2018/10/20/entrenamiento-de-jack-daniels-el-parametro-vdot/)). Using his methodology I went from a 2h46 marathon (Athens) in 2019 to 2h36 in Valencia 2022 and 2h28 in Valencia 2023.

You can find more information in [his book](https://www.amazon.com/Daniels-Running-Formula-Jack-Tupper/dp/1450431836).

All plans cover the 3 months leading up to the race date.

## Examples

Training plan for the 2024 Seville half-marathon:

```bash
vtrain plan --distancia 21 --fechaCarrera 2024-01-28 --tiempoObjetivo 01:35:00
```

Training plan for the 2024 Valencia marathon:

```bash
vtrain plan --distancia 42 --fechaCarrera 2024-01-21 --tiempoObjetivo 02:28:00
```

Example of the last 2 weeks:

![](/doc/img/sample.png)

## Getting Started
1. Install `vtrain`
   * Download `vtrain` for your operating system [here](https://github.com/jandroav/vtrain/releases)
   * Unzip it wherever you like
   * If you're on Linux, run `chmod +x vtrain`
   * Add `vtrain` to your `PATH`
    > Note: macOS users will need to grant permissions in `System Settings` -> `Privacy & Security`.

    ![](/doc/img/macOS_privacy_settings.png)

![](/doc/img/vtrain.png)


