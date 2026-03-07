import { delete_folder } from "../../src/main"
import Client from "ssh2-sftp-client"
import * as core from "@actions/core"

jest.mock("ssh2-sftp-client")
jest.mock("@actions/core")

const sftp = new Client()

describe("delete_folder", () => {
	it("displays a warning when files cannot be deleted", async () => {
		const sftpFake: { rmdir: (dir: string, recursive?: boolean) => Promise<void> } = { rmdir: async () => { throw new Error("Can't delete") } }
		await expect(delete_folder(sftpFake, "my_folder/here/")).rejects.toThrow("Can't delete")
		expect(core.warning).toBeCalled()
	})

	it("attempts to remove the directory recursively", async () => {
		await delete_folder(sftp, "my_folder/here/")
		expect(sftp.rmdir).toBeCalledWith("my_folder/here/", true)
	})
})