import {
	findwidth
} from '../index';

describe('width', () => {
	it('finds width', () => {
		const width = findwidth('a');
		console.log('width', width);
		expect(width).toBe(1);
	});
});