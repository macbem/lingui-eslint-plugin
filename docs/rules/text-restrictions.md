# text-restrictions

Check that translated messages doesn't contain patterns from the rules.

This rule enforces a consistency rules inside your messages.

## rules

`rules` is array of rules when one rule has structure

```json
{
  "patterns": ["first", "second"],
  "message": "error message",
  "replaceWith": "replacement text"
}
```

each `rule` has a structure:

- `patterns` is an array of regex or strings
- `message` is an error message that will be displayed if restricting pattern matches text
- `flags` is a string with regex flags for patterns
- `replaceWith` is an optional string that will replace the matched pattern when autofix is applied. If not provided, the rule violation will not be autofixed.

This rule is fixable using the `--fix` option.

## Example

Restrict specific quotes to be used in the messages:

```json
{
  "lingui/text-restrictions": [
    "error",
    {
      "rules": [
        {
          "patterns": ["‘", "’"],
          "message": "Single quotes should use '",
          "replaceWith": "'"
        }
      ]
    }
  ]
}
```

Example of invalid code with this rule:

```js
t`Hello ‘mate’`
msg`Hello ‘mate’`
t({ message: `Hello ‘mate’` })
```

Example of valid code with this rule:

```js
t`Hello 'mate'`
```
