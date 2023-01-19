import Client from "ssh2-sftp-client"
import { main } from "../../src/main"
import * as core from "@actions/core"

jest.mock("ssh2-sftp-client")
jest.mock("@actions/core")

const sftp = new Client()

const inputs: any = {
	"username": "username",
	"password": "password",
	"server": "server",
	"port": "22",
	"dry-run": false,
	"uploads": "here/ => there/",
	"ignore": "*.yaml",
	"passphrase": undefined,
	"key": undefined,
	"delete": false
}

const testFiles: string[] = [
	"test",
	"hello.ts",
	"ok/something/here.txt",
	"another/file/key.json"
]

describe("main", () => {
	beforeAll(() => {
		jest.spyOn(core, "getInput").mockImplementation((name: string) => {
			return inputs[name]
		})
		jest.spyOn(core, "getBooleanInput").mockImplementation((name: string) => {
			return inputs[name]
		})
	})

	beforeEach(() => {
		inputs["dry-run"] = false
		inputs["delete"] = false
	})

	it("disconnects from sftp when finished", async () => {
		await main(sftp)
		expect(sftp.end).toBeCalledTimes(1)
	})

	it("connects to sftp", async () => {
		await main(sftp)
		expect(sftp.connect).toBeCalledTimes(1)
	})

	it("connects to sftp with correct details", async () => {
		await main(sftp)
		expect(sftp.connect).toBeCalledWith(expect.objectContaining({
			username: "username",
			password: "password",
			host: "server",
			port: 22,
		}))
	})
	
	it("filters all files when dry-run is true", async () => {
		inputs["dry-run"] = true
		await main(sftp)
		const filter_fn = sftp.uploadDir.mock.calls[0][2].filter
		testFiles.forEach(file => expect(filter_fn(file)).toBeFalsy())
	})

	it("doesn't filter all files when dry-run is false", async () => {
		await main(sftp)
		const filter_fn = sftp.uploadDir.mock.calls[0][2].filter
		testFiles.forEach(file => {
			expect(filter_fn(file)).toBeTruthy()
		})
	})

	it("filters some files when dry-run is false and some patterns match", async () => {
		inputs["ignore"] = "*.json"
		await main(sftp)
		const filter_fn = sftp.uploadDir.mock.calls[0][2].filter
		expect(testFiles.every(file => filter_fn(file))).toBeFalsy()
	})

	it("calls setFailed if sftp can't connect", async () => {
		sftp.connect.mockImplementationOnce(() => {throw new Error()})
		await main(sftp)
		expect(core.setFailed).toBeCalled()
	})

	it("uploads folders once", async () => {
		await main(sftp)
		expect(sftp.uploadDir).toBeCalledTimes(1)
	})

	it("attempts to delete existing files when delete is true", async () => {
		inputs["delete"] = true
		await main(sftp)
		expect(sftp.rmdir).toBeCalledTimes(1)
	})
})