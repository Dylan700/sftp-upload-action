import { is_uploadable } from "../../src/main"

const patterns = [
	"test",
	"*.key",
	"**/*.test.*/**"
]

describe("is_uploadable", () => {
	it("returns false when a single pattern matches", () => {
		expect(is_uploadable("secret.key", patterns)).toBeFalsy()
		expect(is_uploadable("./something/secret.key", patterns)).toBeFalsy()
	})

	it("returns true when no patterns match", () => {
		expect(is_uploadable("./imageofkey.png", patterns)).toBeTruthy()
	})

	it("return false when more than one pattern matches", () => {
		expect(is_uploadable("test.key", patterns)).toBeFalsy()
	})
})