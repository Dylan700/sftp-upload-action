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
| dry-run | false | If true, outputs the results of the upload, without actually uploading. |
| delete | false | If true, any existing files in the remote upload directories are deleted. |

## Examples

### Upload everything with password

```yaml
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
uses: actions/checkout@v3
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
uses: actions/checkout@v3
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

## Contributions
Contributions are welcome! If you have something to add or fix, just make a pull request to be reviewed.