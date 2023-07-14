import { file_to_string } from "../../src/main"
import * as fs from "fs"

describe("file_to_string", () => {
	it("returns an empty string if the path is empty", () => {
		expect(file_to_string("")).toHaveLength(0)
	})

	it("returns the correct file data", () => {
		const data = `
			.git*
			*/test/**/*

		`
		fs.writeFileSync("./myignorefile.txt", data)
		expect(file_to_string("./myignorefile.txt")).toBe(data)
		fs.rmSync("./myignorefile.txt")
	})
})