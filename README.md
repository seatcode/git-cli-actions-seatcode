# aem-git-actions-time
AEM Github actions to manage time into the workflows


# Get Time Action

Get the time in the specified time zone

## Example usage

```yaml
      - name: Get Time
        id: time
        uses: nanzm/get-time-action@v1.1
        with:
          timeZone: 8
          format: 'YYYY-MM-DD-HH-mm-ss'
      - name: Usage
        env:
          TIME: "${{ steps.time.outputs.time }}"
        run: |
          echo $TIME
```

## Inputs

| Parameter  | Required | Info                                                         |
| ---------- | -------- | ------------------------------------------------------------ |
| `timeZone` | `false`  | time Zone  Default: 0                                        |
| `format`   | `false`  | timestamp format string  Default: ''                                    |


## Outputs

| Parameter   | Info                                                         |
| ---------- | ------------------------------------------------------------ |
| `time`   | time in the specified time zone|



# Change String Case GitHub Action

This action accepts any string, and outputs three different versions of that string:

- lowercase (`XyZzY` -> `xyzzy`)
- uppercase (`XyZzY` -> `XYZZY`)
- capitalized (`Xyzzy` -> `Xyzzy`)

You can access the outputted strings through the job outputs context. See docs [here](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobsjobs_idoutputs), or the Example Usage section below.

## Inputs

### `string`

**Required** The string you want manipulated

## Outputs

### `lowercase`

`inputStr.toLowerCase()`

Example: `XyZzY` -> `xyzzy`

### `uppercase`

`inputStr.toUpperCase()`

Example: `XyZzY` -> `XYZZY`

### `capitalized`

`inputStr.charAt(0).toUpperCase() + inputStr.slice(1).toLowerCase()`

Example: `XyZzY` -> `Xyzzy`

## Example Usage

```yaml
name: SomeWorkflow
on: [push]
jobs:
  build:
    name: Build
    runs-on: ubuntu-latest
    steps:
      - id: string
        uses: seatcode/git-cli-actions-seatcode@v1.0
        with:
          string: XyZzY
      - id: step2
        run: echo ${{ steps.string.outputs.lowercase }}
```



## License

[MIT](LICENSE)

