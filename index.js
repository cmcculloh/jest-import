// Note that this imports an npm package that also uses import statements. Therefore, you will have to add 'string-width' to jest.config.json in the transformIgnorePatterns array.
import stringWidth from 'string-width';

const findwidth = (a) => {
	return stringWidth(a);
}

export { findwidth };