---
applyTo: '**/*.{js,jsx,ts,tsx,py,c,cc,cpp,cs,h,hpp}'
---

Be brief, clear, direct and straightforward,
do only what user request,
keep it simple and,
Don't introduce things out of context.

# Principles

1. Every app you help to write is a Critical System.
2. All programs have to be error proof.
3. Living beings can die due bad procedures.
4. Processing and Memory must be optimized.
5. Write code understandable by humans.
6. Write the simpliest and shortest code you could write.
7. Write scalable code.
9. Write consistent code.
10. The codebase must be well organized.
11. Don't add possible improvements by your own.
12. Don't add new libraries or modules by your own.


## Security

- For sensible information, rely on .env file and load it to access the that sensible information. e.g. API keys, passwords, db credentials etc.
- Always sanitize user input to prevent SQL injection, XSS, CSRF and other attacks.
- For simple Authentication always rely on JWT.
- For external user authentication OAuth2.0, when available.
- Always process tokens, JWTs, encrypted data from server side.
- Never save high privacy information at client side.
- Never serve high privacy files.
- Never serve high privacy data.


## Code Style & Patterns

- Variables names must be human-readable.
- Variables longer than 2 words, please abbreviate the last 2 words.
- No in-line comments. Only docstrings.
- Docstring must define a concise description.
- Docstring must define its params or args with types.
- Docstring must define the return type
- Docstring must be defined using the native systax of the programming language where it is defined.
- Prior range loops over normal loops.
- Prior map functions over range loops.
- Prior guards over high complexity conditionals.
- Codebase must create a 'lib' folder to save custom libraries and helper functions.
- Codebase must organize the 'lib' folder by topic.
- Codebase must name files and folders in kebab case by default (can be overriden).

### Javascript

- Formats the code with the Javascript Google Code Guidelines.
- Prior 'function' over 'const' keyword for function declaration, when 'const' features are not needed.
- Prior root over relative imports. e.g. 'import foo from "@/somedir/foo"', over "import foo from "../foo"'

### Python

- Formats the code with th PEP8 Code Guidelines.

### C/C++

- Formats the code with the C/C++ Google Code Guidelines.
- Follow The Power of 10: Rules for Developing Safety-Critical Code:
  1. Avoid complex flow constructs, such as goto and recursion.
  2. All loops must have fixed bounds. This prevents runaway code.
  3. Avoid heap memory allocation after initialization.
  4. Restrict functions to a single printed page.
  5. Use a minimum of two runtime assertions per function.
  6. Restrict the scope of data to the smallest possible.
  7. Check the return value of all non-void functions, or cast to void to indicate the return value is useless.
  8. Use the preprocessor only for header files and simple macros.
  9. Limit pointer use to a single dereference, and do not use function pointers.
  10. Compile with all possible warnings active; all warnings should then be addressed before release of the software.


### Headers

- prior global imports over relative imports.
import Foo from "@/some-dir/Foo"        // Yes
import { Foo } from "../some-dir/Foo"   // No

- all headers at the top of the script.
// Yes
import Foo from "@/Foo"
code ...

// No
import Foo from "@/Foo"
code ...
import Bar from "@/Bar"
code ....

- importing multiple object from the same library.
// Yes
import { Foo, Bar } from "@/FooBar"

// No
import { Foo } from "@/FooBar"
import { Bar } from "@/FooBar"

## Variables

- use as maximum 3 word to name variables.
// Yes
const tooLongVariable = ""

// No
const tooLongVariableToAssignIsIllegible = ""

## Functions

- always 2 newlines between functions
// Yes
function functionOne() {}


function functionTwo() {}

// No
function functionOne() {}
function functionTwo() {}

- use the "const" keyword to create function just if needed, otherwise always use "function" keyword.
// Yes
function goodFunction() {}

// No
const goodFunction = () => {}

## Classes

- first constructor always.
- second all members.
- third all methods.

## Members

- apply all the rules of Variables.
- first private members.
- second protected members.
- third public members.

## Methods

- apply all the rules of Functions.
- first private members.
- second protected.members.
- third public members.

## Scopes

- always 1 newline before conditionals, loops or function calls.
- try to keep only 1 try catch block per function.

## Comments

- no inline comments.
// Yes
const simpleVariable = 0;

// No
const simpleVariable = 0;  // This variable is a very simple variable.

- no comments above code.
//Yes
const variable = someFunction();

// No
// this is a call to assign the varible with the output of someFunction()
const variable = someFunction();

- the only comments allowed are the docstrings.

- no comment over classes or contructors.

- docstrings must be native of the script language.
Javascript is used as example language, but these rules should be applied to all other languages
C, C++, Rust, Typescript, Javascript, Python.
```javascript
/**
 * [@route <HTTP method> <path>] @access [Private|Public]
 * @desc function/class/method description ... 
 * @param {[arg|query|body]:<paramName>} argument or parameter ...
 * @return {<type>} [Result|Response]
 */
```
where:
  * <>: required
  * []: optional

- docstring must be unique per scope, no nested docstrings
// Yes
/**
 * docstring ...
 */
function() {}

// No 
/**
 * docstring ...
 */
function() {
  /**
 * another docstring ...
 */
 innerFunction() {}
}
