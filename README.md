# SEAT:CODE - utilities git-actions
Github project to execute utilities into the workflows, this project contains multiples functions to manage labels, 
timeStamp, branch review as naming convention, etc.

- Get Time Action
  - Get the time in the specified time zone [View code](https://github.com/seatcode/git-cli-actions-seatcode/blob/master/src/action/time.ts)
- Manage labels
  - useful to obtain lowerCase, upperCase or capitalize [View code](https://github.com/seatcode/git-cli-actions-seatcode/blob/master/src/action/labels.ts)

    

### Inputs

| Parameter  | Required | Info                                                         |
| ---------- | -------- | ------------------------------------------------------------ |
| `timeZone` | `false`  | Time Zone  Default: 0                                        |
| `format`   | `false`  | Timestamp format string  Default: ''                                    |
| `string`   | `false`  | Label to transform (lower, upper, capitalize): ''                                    |


### Outputs

| Parameter   | Info                                                         |
| ---------- | ------------------------------------------------------------ |
| `time`   | Time in the specified time zone|
| `lowercase`   | Lowercase (`XyZzY` -> `xyzzy`)|
| `uppercase`   | Uppercase (`XyZzY` -> `XYZZY`)|
| `capitalized`   | Capitalized (`Xyzzy` -> `Xyzzy`)|


### Examples usage
```yaml
name: my-workflow
on:
  push:
    branches:
      - master
jobs:
  check-time:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Git Source
        uses: actions/checkout@v3
        
      - name: test
        id: time
        uses: ./
        with:
          timeZone: 8
          format: 'YYYY-MM-DD_HH:mm:ss'
      - name: test-output
        env:
          TIME: "${{ steps.time.outputs.time }}"
        run: |
          echo $TIME

  check-string-changes:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Git Source
        uses: actions/checkout@v3

      - name: test
        id: cadena
        uses: ./
        with:
          string: "A SIMPLE TEST TO lowercase"
      - name: test-output
        env:
          CADENA: "${{ steps.cadena.outputs.lowercase }}"
        run: |
          echo $CADENA  
```



## License

[MIT](LICENSE)

