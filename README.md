# vtrain
Utilidad para generar planes de entrenamiento de media maratón y maratón siguiente los métodos de [Jack Daniels](https://en.wikipedia.org/wiki/Jack_Daniels_(coach)) ([VDOT](https://planesmaraton.com/2018/10/20/entrenamiento-de-jack-daniels-el-parametro-vdot/)). Con su metodología he conseguido bajar de 2h46 en maratón (Atenas) en 2019 a 2h36 en Valencia 2022 y 2h28 en Valencia 2023.

Puedes consultar más información en [su libro](https://www.amazon.com/Daniels-Running-Formula-Jack-Tupper/dp/1450431836).

Todos los planes son de 3 meses a partir de la fecha de la carrera a preparar.

## Ejemplos

Plan de entreno para media maratón de Sevilla 2024:

```bash
vtrain plan --distancia 21 --fechaCarrera 2024-01-28 --tiempoObjetivo 01:35:00
```

Plan de entreno para maratón de Valencia 2024:

```bash
vtrain plan --distancia 42 --fechaCarrera 2024-01-21 --tiempoObjetivo 02:28:00
```

Ejemplo de las últimas 2 semanas:

![](/doc/img/sample.png)

## Getting Started
1. Instala `vtrain`
   * Descarga `vtrain` para tu sistema operativo [aquí](https://github.com/jandroav/vtrain/releases)
   * Descomprímelo dónde quieras
   * Si estás en Linux ejecuta `chmod +x vtrain`
   * Configura `vtrain` en tu variable `PATH`
    > Nota: Usuarios de macOS necesitarán otorgar permisos en `System Settings` -> `Privacy & Security`.

    ![](/doc/img/macOS_privacy_settings.png)

![](/doc/img/vtrain.png)


