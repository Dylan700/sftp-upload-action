import { delete_folder } from "../../src/main"
import Client from "ssh2-sftp-client"
import * as core from "@actions/core"

jest.mock("ssh2-sftp-client")
jest.mock("@actions/core")

const sftp = new Client()

describe("delete_folder", () => {
	it("displays a warning when files cannot be deleted", async () => {
		const sftpFake: any = { rmdir: async () => { throw new Error("Can't delete") } }
		await delete_folder(sftpFake, "my_folder/here/")
		expect(core.warning).toBeCalled()
	})

	it("attempts to remove the directory recursively", async () => {
		await delete_folder(sftp, "my_folder/here/")
		expect(sftp.rmdir).toBeCalledWith("my_folder/here/", true)
	})
})