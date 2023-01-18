import { parse_ignored } from "../../src/main"

describe("parse_ignored", () => {
	it("ignores newlines and tabs", () => {
		const data = `
			.git*
			*/test/**/*

		`
		expect(parse_ignored(data)).toHaveLength(2)
	})

	it("returns the correct data", () => {
		const data = `
			.git*
			*/test/**/*

		`
		expect(parse_ignored(data)[0]).toBe(".git*")
		expect(parse_ignored(data)[1]).toBe("*/test/**/*")

	})

	it("returns empty array for empty input", () => {
		expect(parse_ignored("")).toStrictEqual([])
	})

	it("returns empty array for single space input", () => {
		expect(parse_ignored(" ")).toStrictEqual([])
	})
})