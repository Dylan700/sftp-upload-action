import Client from "ssh2-sftp-client"
import { main } from "../../src/main"
import util from "util"
import * as core from "@actions/core"
import { exec } from "child_process"

const execPromise = util.promisify(exec)

import { measure } from "kelonio"

jest.mock("@actions/core")

const sftp = new Client()

const inputs: any = {
	"username": "username",
	"password": "password",
	"server": "localhost",
	"port": "2222",
	"dry-run": false,
	"uploads": "/tmp/upload/ => /tmp/upload/",
	"ignore": "*.yaml",
	"passphrase": undefined,
	"key": undefined,
	"delete": true
}

jest.spyOn(core, "getInput").mockImplementation((name: string) => {
	return inputs[name]
})
jest.spyOn(core, "getBooleanInput").mockImplementation((name: string) => {
	return inputs[name]
})

core.setFailed.mockImplementation((e) => {throw new Error(e)})

jest.setTimeout(1000*60)

describe("Testing performance for uploading some 2MB files", () => {
	it("is fast", async () => {
		// create some files to upload first
		const promises = []
		await execPromise("rm -rdf /tmp/upload && mkdir /tmp/upload")
		for(let i = 0; i < 5; i++){
			promises.push(execPromise(`head -c 2000000 </dev/urandom >/tmp/upload/${i}.bin`))
		}
		await Promise.all(promises)

		const measurement = await measure(() => main(sftp), { meanUnder: 400, iterations: 25 }) 
		console.info(`Mean: ${measurement.mean}ms`)
	})
})


describe("Testing performance for uploading some 1MB files", () => {
    it("is fast", async () => {
        // create some files to upload first
        const promises = []
        await execPromise("rm -rdf /tmp/upload && mkdir /tmp/upload")
        for(let i = 0; i < 10; i++){
            promises.push(execPromise(`head -c 1000000 </dev/urandom >/tmp/upload/${i}.bin`))
        }
        await Promise.all(promises)

        const measurement = await measure(() => main(sftp), { meanUnder: 400, iterations: 50 }) 
        console.info(`Mean: ${measurement.mean}ms`)
    })
})

describe("Testing performance for uploading some 500KB files", () => {
    it("is fast", async () => {
        // create some files to upload first
        const promises = []
        await execPromise("rm -rdf /tmp/upload && mkdir /tmp/upload")
        for(let i = 0; i < 20; i++){
            promises.push(execPromise(`head -c 500000 </dev/urandom >/tmp/upload/${i}.bin`))
        }
        await Promise.all(promises)

        const measurement = await measure(() => main(sftp), { meanUnder: 400, iterations: 100 }) 
        console.info(`Mean: ${measurement.mean}ms`)
    })
})

describe("Testing performance for uploading a large number of small files", () => {
    it("is fast", async () => {
        // create some files to upload first
        const promises = []
        await execPromise("rm -rdf /tmp/upload && mkdir /tmp/upload")
        for(let i = 0; i < 100; i++){
            promises.push(execPromise(`head -c 10000 </dev/urandom >/tmp/upload/${i}.bin`))
        }
        await Promise.all(promises)

        const measurement = await measure(() => main(sftp), { meanUnder: 500, iterations: 50 }) 
        console.info(`Mean: ${measurement.mean}ms`)
    })
})

describe("Testing performance for uploading a single large file", () => {
    it("is fast", async () => {
        // create a large file to upload
        await execPromise("rm -rdf /tmp/upload && mkdir /tmp/upload")
        await execPromise(`head -c 50000000 </dev/urandom >/tmp/upload/large.bin`)

        const measurement = await measure(() => main(sftp), { meanUnder: 2000, iterations: 10 }) 
        console.info(`Mean: ${measurement.mean}ms`)
    })
})