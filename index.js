// Note that this imports an npm package that also uses import statements.
// Therefore, you will have to add 'string-width' to jest.config.json in the transformIgnorePatterns array.
import stringWidth from "string-width";
import data from "./node_modules/test-json-import/data.json" assert { type: "json" };
import { showMeTheData } from "test-json-import/index.js";

const getData = () => {
	console.log(JSON.stringify(data));
	return JSON.stringify(data);
};

const findwidth = (a) => {
	return stringWidth(a);
};

export { findwidth, getData, showMeTheData };
