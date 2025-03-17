import { rule, Option, RestrictionRule } from '../../../src/rules/text-restrictions'

import { RuleTester } from '@typescript-eslint/rule-tester'

describe('', () => {})

const quotesRule: RestrictionRule = {
  patterns: ["\"", "\u201C", "\u201D"],
  message: `Quotes should be ' or "`,
}

const quotesRuleWithFix: RestrictionRule = {
  patterns: ["\"", "\u201C", "\u201D"],
  message: `Quotes should be ' or "`,
  replaceWith: "'"
}

const bracketRule: RestrictionRule = {
  patterns: ['<', '>', '&lt;', '&gt;'],
  message: 'Exclude <,> symbols from translations',
}

const wordRule: RestrictionRule = {
  patterns: ['e-mail'],
  message: `Use email instead of e-mail`,
  flags: 'i',
}

const wordRuleWithFix: RestrictionRule = {
  patterns: ['e-mail'],
  message: `Use email instead of e-mail`,
  flags: 'i',
  replaceWith: 'email'
}

// Smart quotes test rule
const smartQuotesRule: RestrictionRule = {
  patterns: ["\u201C", "\u201D"],
  message: `Smart quotes are not allowed`,
}

const smartQuotesRuleWithFix: RestrictionRule = {
  patterns: ["\u201C", "\u201D"],
  message: `Smart quotes are not allowed`,
  replaceWith: "\""
}

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
})

ruleTester.run<string, Option[]>('text-restrictions (ts)', rule, {
  valid: [
    {
      code: 't`Hello`',
      options: [
        {
          rules: [quotesRule],
        },
      ],
    },
    {
      code: 't`Hello ${kek}`',
      options: [
        {
          rules: [quotesRule],
        },
      ],
    },
    {
      code: 't({message: `Hello ${kek}`})',
      options: [
        {
          rules: [quotesRule],
        },
      ],
    },
    {
      code: 'b({message: `Hell"o"`})',
      options: [
        {
          rules: [quotesRule],
        },
      ],
    },
    {
      code: '<Trans>Hello</Trans>',
      options: [
        {
          rules: [quotesRule],
        },
      ],
    },
    {
      code: '<Trans>Email</Trans>',
      options: [
        {
          rules: [wordRule],
        },
      ],
    },
    {
      code: '<Trans>email</Trans>',
      options: [
        {
          rules: [wordRule],
        },
      ],
    },
    {
      code: '<div>&lt;<Trans>email</Trans></div>',
      options: [
        {
          rules: [bracketRule],
        },
      ],
    },
    {
      code: 'c`<`',
      options: [
        {
          rules: [bracketRule],
        },
      ],
    },
    {
      code: "requiredOption('--config <configPath>', 'path to the lambda configuration')",
      options: [
        {
          rules: [bracketRule],
        },
      ],
    },
  ],

  invalid: [
    {
      code: 't`Hell"o"`',
      options: [
        {
          rules: [quotesRule],
        },
      ],
      errors: [{ messageId: 'default', data: { message: quotesRule.message } }],
    },
    {
      code: 't`Hell"o"`',
      options: [
        {
          rules: [quotesRuleWithFix],
        },
      ],
      errors: [{ messageId: 'default', data: { message: quotesRuleWithFix.message } }],
      output: "t`Hell'o'`",
    },
    {
      code: 'msg`Hell"o"`',
      options: [
        {
          rules: [quotesRule],
        },
      ],
      errors: [{ messageId: 'default', data: { message: quotesRule.message } }],
    },
    {
      code: 'msg`Hell"o"`',
      options: [
        {
          rules: [quotesRuleWithFix],
        },
      ],
      errors: [{ messageId: 'default', data: { message: quotesRuleWithFix.message } }],
      output: "msg`Hell'o'`",
    },
    {
      code: 'defineMessage`Hell"o"`',
      options: [
        {
          rules: [quotesRule],
        },
      ],
      errors: [{ messageId: 'default', data: { message: quotesRule.message } }],
    },
    {
      code: 'defineMessage`Hell"o"`',
      options: [
        {
          rules: [quotesRuleWithFix],
        },
      ],
      errors: [{ messageId: 'default', data: { message: quotesRuleWithFix.message } }],
      output: "defineMessage`Hell'o'`",
    },
    {
      code: 't({message: `Hell"o"`})',
      options: [
        {
          rules: [quotesRule],
        },
      ],
      errors: [{ messageId: 'default', data: { message: quotesRule.message } }],
    },
    {
      code: 't({message: `Hell"o"`})',
      options: [
        {
          rules: [quotesRuleWithFix],
        },
      ],
      errors: [{ messageId: 'default', data: { message: quotesRuleWithFix.message } }],
      output: "t({message: `Hell'o'`})",
    },
    {
      code: "t({message: 'Hell\"o\"'})",
      options: [
        {
          rules: [quotesRule],
        },
      ],
      errors: [{ messageId: 'default', data: { message: quotesRule.message } }],
    },
    {
      code: "t({message: 'Hell\"o\"'})",
      options: [
        {
          rules: [quotesRuleWithFix],
        },
      ],
      errors: [{ messageId: 'default', data: { message: quotesRuleWithFix.message } }],
      output: "t({message: 'Hell\\'o\\''})",
    },
    {
      code: '<Trans>Hell"o"</Trans>',
      options: [
        {
          rules: [quotesRule],
        },
      ],
      errors: [{ messageId: 'default', data: { message: quotesRule.message } }],
    },
    {
      code: '<Trans>Hell"o"</Trans>',
      options: [
        {
          rules: [quotesRuleWithFix],
        },
      ],
      errors: [{ messageId: 'default', data: { message: quotesRuleWithFix.message } }],
      output: "<Trans>Hell'o'</Trans>",
    },
    {
      code: 't`Hell"o"`',
      options: [
        {
          rules: [
            quotesRule,
            {
              patterns: ['o'],
              message: 'o is forbidden',
            },
          ],
        },
      ],
      errors: [
        { messageId: 'default', data: { message: quotesRule.message } },
        { messageId: 'default', data: { message: 'o is forbidden' } },
      ],
    },
    {
      code: '<Trans>E-mail</Trans>',
      options: [
        {
          rules: [wordRule],
        },
      ],
      errors: [{ messageId: 'default', data: { message: wordRule.message } }],
    },
    {
      code: '<Trans>E-mail</Trans>',
      options: [
        {
          rules: [wordRuleWithFix],
        },
      ],
      errors: [{ messageId: 'default', data: { message: wordRuleWithFix.message } }],
      output: '<Trans>email</Trans>',
    },
    {
      code: '<Trans>e-mail</Trans>',
      options: [
        {
          rules: [wordRule],
        },
      ],
      errors: [{ messageId: 'default', data: { message: wordRule.message } }],
    },
    {
      code: '<Trans>e-mail</Trans>',
      options: [
        {
          rules: [wordRuleWithFix],
        },
      ],
      errors: [{ messageId: 'default', data: { message: wordRuleWithFix.message } }],
      output: '<Trans>email</Trans>',
    },
    {
      code: '<Trans>&lt;email</Trans>',
      options: [
        {
          rules: [bracketRule],
        },
      ],
      errors: [{ messageId: 'default', data: { message: bracketRule.message } }],
    },
    {
      code: 't`<Hello`',
      options: [
        {
          rules: [bracketRule],
        },
      ],
      errors: [{ messageId: 'default', data: { message: bracketRule.message } }],
    },
    {
      code: '<Trans>Hello \u201Csmart quotes\u201D</Trans>',
      options: [
        {
          rules: [smartQuotesRule],
        },
      ],
      errors: [{ messageId: 'default', data: { message: smartQuotesRule.message } }],
    },
    {
      code: '<Trans>Hello \u201Csmart quotes\u201D</Trans>',
      options: [
        {
          rules: [smartQuotesRuleWithFix],
        },
      ],
      errors: [{ messageId: 'default', data: { message: smartQuotesRuleWithFix.message } }],
      output: '<Trans>Hello "smart quotes"</Trans>',
    },
    {
      code: 't`Hello \u201Csmart quotes\u201D`',
      options: [
        {
          rules: [smartQuotesRuleWithFix],
        },
      ],
      errors: [{ messageId: 'default', data: { message: smartQuotesRuleWithFix.message } }],
      output: 't`Hello "smart quotes"`',
    },
  ],
})
