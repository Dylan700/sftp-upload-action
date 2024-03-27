<div align="center">
<h1>SFTP Upload GitHub Action</h1>

[![Continuous Integration](https://github.com/Dylan700/sftp-upload-action/actions/workflows/ci.yaml/badge.svg)](https://github.com/Dylan700/sftp-upload-action/actions/workflows/ci.yaml)
[![CodeQL](https://github.com/Dylan700/sftp-upload-action/actions/workflows/codeql-analysis.yaml/badge.svg)](https://github.com/Dylan700/sftp-upload-action/actions/workflows/codeql-analysis.yaml)

</div>

<hr>

This action uploads files to a remote server using the SFTP protocol. Unlike other implementations, this action has tests and supports more options.
</div>

## Table of Contents
1. [Action Inputs](#Inputs)
1. [Examples](#Examples)
1. [Contributions](#Contributions)
1. [Testing](#Running-Without-Actions)

## Inputs

| Input | Required | Description | 
| -- | -- | -- |
| server | true | The SFTP server (e.g. sftp.server.com) |
| username | true | The SFTP username |
| password | false | The SFTP password |
| key | false | The SFTP private key |
| passphrase | false | The SFTP private key passphrase (if applicable)|
| port | false | The SFTP port, defaults to port 22 |
| uploads | true | The folders to upload. In the format of `folder/ => upload_folder/`
| ignore | false | A list of glob patterns for files that should be ignored. (Like the patterns you would find in .gitignore)
| ignore-from | false | The path to a file containing a list of glob patterns for files that should be ignored. (Like the patterns you would find in .gitignore)
| dry-run | false | If true, outputs the results of the upload, without actually uploading. |
| delete | false | If true, any existing files in the remote upload directories are deleted. |

## Examples

### Upload everything with password

```yaml
uses: actions/checkout@v4
uses: Dylan700/sftp-upload-action@latest
with:
  server: sftp.server.com
  username: jason-bourne
  password: ${{secrets.password}}
  port: 22
  uploads: |
  ./ => ./www/public_html/
```

### Upload everything with password, ignoring .git

```yaml
uses: actions/checkout@v4
uses: Dylan700/sftp-upload-action@latest
with:
  server: sftp.server.com
  username: jason-bourne
  password: ${{secrets.password}}
  port: 22
  uploads: |
    ./ => ./www/public_html/
  ignore: |
    *.git
    */**/*git*
```

### Upload multiple folders with private key

```yaml
uses: actions/checkout@v4
uses: Dylan700/sftp-upload-action@latest
with:
  server: sftp.server.com
  username: jason-bourne
  key: ${{secrets.key}}
  passphrase: ${{secrets.passphrase}}
  port: 22
  uploads: |
    ./html/ => ./www/public_html/
    ./src/ => ./www/src/
```

### Upload multiples folders and delete existing files in those folders

```yaml
uses: actions/checkout@v4
uses: Dylan700/sftp-upload-action@latest
with:
  server: sftp.server.com
  username: jason-bourne
  key: ${{secrets.key}}
  passphrase: ${{secrets.passphrase}}
  port: 22
  uploads: |
    ./html/ => ./www/public_html/
    ./src/ => ./www/src/
  delete: 'true'
```


### Upload Specific Files
Specific files can be uploaded be negating the `ignore` inputs with an exclamation `!` character. The example below will only upload files that have a name matching `index.html` or `.htaccess`.

```yaml
uses: actions/checkout@v4
uses: Dylan700/sftp-upload-action@latest
with:
  server: sftp.server.com
  username: jason-bourne
  key: ${{secrets.key}}
  passphrase: ${{secrets.passphrase}}
  port: 22
  uploads: |
    ./html/ => ./www/public_html/
  ignore: |
    !index.html
    !.htaccess
```

## Contributions
Contributions are welcome! If you have something to add or fix, just make a pull request to be reviewed.

## Running Without Actions
If you'd like to run this script without an action for troubleshooting or testing purposes, you can set all the inputs as environment variables and run the node file directly. For example:

```bash
#!/bin/bash

export INPUT_USERNAME=username
export INPUT_PASSWORD=password
export INPUT_PORT=2222
export INPUT_SERVER=localhost
export INPUT_UPLOADS="./ => ./"
export INPUT_DELETE=false

env "INPUT_DRY-RUN=true" bash -c "node ./dist/index.js"
```

When you're testing e2e, don't forget to start the SFTP server with `docker-compose up -d`.
