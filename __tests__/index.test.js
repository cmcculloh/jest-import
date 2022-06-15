import data from "test-json-import/data.json" assert { type: "json" };
import { findwidth, getData, showMeTheData } from "../index.js";

describe("width", () => {
	it("finds width", () => {
		const width = findwidth("a");
		console.log("width", width);
		expect(width).toBe(1);
	});
});

describe("json import", () => {
	it("works", () => {
		const dataStr = getData();
		expect(dataStr).toBe(JSON.stringify(data));
	});
});

describe("json imports within modules", () => {
	it("work", () => {
		const dataStr = showMeTheData();
		expect(dataStr).toBe(`{"id":1}`);
	});
});
