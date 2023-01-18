import { parse_uploads } from "../../src/main"
import Upload from "../../src/types/Upload"

describe("parse_uploads", () => {
	it("throws an error for an empty strings", () => {
		expect(() => parse_uploads("")).toThrow()
	})
	it("returns correct data for single upload", () => {
		const data = "some/file/ => final/dir/"
		const result: Upload[] = parse_uploads(data)
		expect(result).toHaveLength(1)
		expect(result[0].from).toBe("some/file/")
		expect(result[0].to).toBe("final/dir/")
	})

	it("returns correct data for multiple uploads", () => {
		const data = `
			some/file/ => final/dir/
			another/file/ => ok/dir/
			lol/file/something/ => /final/dir/
		`
		const result: Upload[] = parse_uploads(data)
		expect(result).toHaveLength(3)
		expect(result[0].from).toBe("some/file/")
		expect(result[0].to).toBe("final/dir/")
		expect(result[1].from).toBe("another/file/")
		expect(result[1].to).toBe("ok/dir/")
		expect(result[2].from).toBe("lol/file/something/")
		expect(result[2].to).toBe("/final/dir/")
	})

	it("ignores empty lines", () => {
		const data = `

			some/file/ => final/dir/

			lol/file/something/ => /final/dir/


		`
		const result: Upload[] = parse_uploads(data)
		expect(result).toHaveLength(2)
		expect(result[0].from).toBe("some/file/")
		expect(result[0].to).toBe("final/dir/")
		expect(result[1].from).toBe("lol/file/something/")
		expect(result[1].to).toBe("/final/dir/")
	})
})