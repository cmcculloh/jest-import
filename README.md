# jest-import

The purpose of this repo is to document how to properly use jest with esm import statements

1. Download repo
2. `yarn install` (or `npm install`)
3. `yarn jest` (or `npm jest`)


## package.json

At the minimum, you will need to have the following devDependencies:

```
  "devDependencies": {
    "@babel/preset-env": "^7.16.11",
    "babel-jest": "^27.5.1",
    "jest": "^27.5.1"
  },
```

Specifying a minimum node in engines is optional, but a good signal to use:

```
  "engines": {
    "node": ">=12"
  }
```

### type: "module"

If you plan to use `type: "module"` in your package.json, you will have to use `babel.config.json` and `jest.config.json` _instead of_ `babel.config.js` and `jest.config.js`. If you try and use `.js` files, you will get the following error:

```
ReferenceError: module is not defined in ES module scope
This file is being treated as an ES module because it has a '.js' file extension and '/.../package.json' contains "type": "module". To treat it as a CommonJS script, rename it to use the '.cjs' file extension.
```

## babel.config.json

At minimum, you will need to specify the following in your babel.config.json:

```
{
    "presets": [
        [
            "@babel/preset-env"
        ]
    ]
}
```


## jest.config.json

At minimum, you will need to specify the following in your babel.config.json:

```
{
    "transformIgnorePatterns": [
        "node_modules/(?!(npm-package|names|go-here)/)"
    ]
}
```

*NOTE*: Not only will packages that you depend on that use `import` statements need to be specified here, but any packages that _those_ packages depend on that use `import` will need to be specified here. These aren't terribly difficult to track down. For instance, if you remove the ignorePatterns from this project, you will get the following error when you run `yarn jest`:

```
Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
     • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation

    Details:

    jest-import/node_modules/string-width/index.js:1
    ({"Object.<anonymous>":function(module,exports,require,__dirname,__filename,jest){import stripAnsi from 'strip-ansi';
                                                                                      ^^^^^^

    SyntaxError: Cannot use import statement outside a module

      1 | // Note that this imports an npm package that also uses import statements. Therefore, you will have to add 'string-width' to jest.config.json in the transformIgnorePatterns array.
    > 2 | import stringWidth from 'string-width';
        | ^
      3 |
      4 | const findwidth = (a) => {
      5 | 	return stringWidth(a);

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1728:14)
      at Object.<anonymous> (index.js:2:1)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        0.766 s, estimated 1 s
Ran all test suites.
```

So, here it is indicating that jest is failing on the `import` statement for `string-width`. Adding `string-width` to the ignore pattern, to make it look this this:

```
{
    "transformIgnorePatterns": [
        "node_modules/(?!(string-width)/)"
    ]
}
```

and running `yarn jest` again will now result in the following error:

```
 FAIL  __tests__/index.test.js
  ● Test suite failed to run

    Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
     • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation

    Details:

    /jest-import/node_modules/string-width/node_modules/strip-ansi/index.js:1
    ({"Object.<anonymous>":function(module,exports,require,__dirname,__filename,jest){import ansiRegex from 'ansi-regex';
                                                                                      ^^^^^^

    SyntaxError: Cannot use import statement outside a module

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1728:14)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        0.732 s
Ran all test suites.
```

The key here is this bit:

```
    /jest-import/node_modules/string-width/node_modules/strip-ansi/index.js:1
    ({"Object.<anonymous>":function(module,exports,require,__dirname,__filename,jest){import ansiRegex from 'ansi-regex';
                                                                                      ^^^^^^
```

It is telling you that `strip-ansi/index.js` line 1 is trying to use `import` for `ansi-regex`. So you will need to add that to the ignore pattern as well, like this:

```
{
    "transformIgnorePatterns": [
        "node_modules/(?!(string-width|strip-ansi)/)"
    ]
}
```

Running `yarn jest` will result in yet another error, this one slightly different:

```
 FAIL  __tests__/index.test.js
  ● Test suite failed to run

    Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
     • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation

    Details:

    /jest-import/node_modules/string-width/node_modules/ansi-regex/index.js:1
    ({"Object.<anonymous>":function(module,exports,require,__dirname,__filename,jest){export default function ansiRegex({onlyFirst = false} = {}) {
                                                                                      ^^^^^^

    SyntaxError: Unexpected token 'export'

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1728:14)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        0.733 s
Ran all test suites.
```

Again, the key here being this chunk:

```
    /jest-import/node_modules/string-width/node_modules/ansi-regex/index.js:1
    ({"Object.<anonymous>":function(module,exports,require,__dirname,__filename,jest){export default function ansiRegex({onlyFirst = false} = {}) {
                                                                                      ^^^^^^
```

It is indicating that `ansi-regex` is attempting to use `export`. So, add `ansi-regex` to your ignore pattern, which will now look like this:

```
{
    "transformIgnorePatterns": [
        "node_modules/(?!(string-width|strip-ansi|ansi-regex)/)"
    ]
}
```

and run `yarn jest` and now everything works!



### jest.config.json Projects Setting

*warning!* If you attempt to use the `projects` field in your jest config, it will ignore your `transformIgnorePatterns` property outside of the project. You will have to set this on a project-by-project basis, like this:

```
	"projects": [
		{
			"displayName": "jest-import",
			"testMatch": [
				"<rootDir>/**/__tests__/*.[jt]s?(x)"
			],
			"transformIgnorePatterns": [
				"node_modules/(?!(string-width|strip-ansi|ansi-regex)/)"
			]
		}
	],
```