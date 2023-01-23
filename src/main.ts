import { debug, getBooleanInput, getInput, setFailed, warning } from "@actions/core"
import * as Client from "ssh2-sftp-client"
import Upload from "./types/Upload"
import minimatch, { MinimatchOptions } from "minimatch"

const minimatch_options: MinimatchOptions = {
	dot: true,
	matchBase: true
}

/** 
 * Converts a list of uploads as as string into an array of objects
 * Example Format: 
 * from/ => to/
 * from/file => to/
 * */
function parse_uploads(uploads_str: string): Upload[] {
	const data: string[] = uploads_str.split("\n").filter(d => d != "")
	const uploads: Upload[] = []

	if(data.length === 0)
		throw new Error("No uploads were defined, please ensure you enter destinations to upload your files!")

	data.forEach(upload => {
		const [from, to] = upload.trim().split("=>")
		if(!from || !to)
			return
		uploads.push({
			from: from.trim(),
			to: to.trim()
		})
	})
	return uploads
}

// returns a list of glob patterns from a string
function parse_ignored(ignored_str: string): string[] {
	return ignored_str.trim().split("\n").map(Function.prototype.call, String.prototype.trim).filter(e => e != "")
}

// determines whether a file should be uploaded
function is_uploadable(file: string, patterns: string[]){
	return !patterns.some(p => minimatch(file, p, minimatch_options))
}

// recursively delete a remote folder
async function delete_folder(sftp: Client, dir: string){
	debug(`Deleting existing files for ${dir}...`)
	try{
		await sftp.rmdir(dir, true)
		debug(`${dir} has been deleted.`)
	}catch(e: any){
		warning(`Unable to delete existing files for ${dir} before upload.`)
	}
}

async function main(sftp: Client){
	try {
		const server: string = getInput("server")
		const username: string = getInput("username")
		const password: string = getInput("password")
		const passphrase: string = getInput("passphrase")
		const key: string= getInput("key")
		const port: number = +getInput("port")
		const isDryRun: boolean = getBooleanInput("dry-run")
		const uploads: Upload[] = parse_uploads(getInput("uploads"))
		const ignored: string[] = parse_ignored(getInput("ignore"))
		const shouldDelete: boolean = getBooleanInput("delete")
		debug(`Connecting to ${server} as ${username} on port ${port}`)

		await sftp.connect({
			host: server,
			username: username,
			password: password,
			port: port,
			privateKey: key,
			passphrase: passphrase,
		})

		const promises: Promise<string | void>[] = []

		debug("Deleting folders...")
		for(const upload of uploads) {
			shouldDelete && !isDryRun ? promises.push(delete_folder(sftp, upload.to)) : null
		}
		await Promise.all(promises)
		promises.splice(0,promises.length)

		debug("Preparing upload...")
		for(const upload of uploads) {
			debug(`Processing ${upload.from} to ${upload.to}`)
			promises.push(sftp.uploadDir(upload.from, upload.to, {
				filter: file => {
					if(is_uploadable(file, ignored)){
						if(isDryRun){
							console.log(`${file} would have been uploaded`)
							return false
						}else{
							debug(`Uploading ${file}`)
							return true
						}
					}
					debug(`Skipping ${file}`)
					return false
				}
			}))
		}
		await Promise.all(promises)
		debug("Upload process complete.")
		await sftp.end()
		debug("Session ended.")

	} catch (error: any) {
		setFailed(error.message)
	}
}

export { main, parse_uploads, parse_ignored, is_uploadable, delete_folder }