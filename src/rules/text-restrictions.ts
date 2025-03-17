import { TSESTree } from '@typescript-eslint/utils'

import {
  getText,
  LinguiCallExpressionMessageQuery,
  LinguiTaggedTemplateExpressionMessageQuery,
  LinguiTransQuery,
} from '../helpers'
import { createRule } from '../create-rule'

export type RestrictionRule = {
  patterns: string[]
  message: string
  flags?: string
  replaceWith?: string
}

type RegexRule = {
  patterns: RegExp[]
  message: string
  flags?: string
  replaceWith?: string
}

export type Option = {
  rules: RestrictionRule[]
}

export const name = 'text-restrictions'
export const rule = createRule<Option[], string>({
  name,
  meta: {
    docs: {
      description: 'Text restrictions',
      recommended: 'error',
    },
    messages: {
      default: '{{ message }}',
    },
    schema: [
      {
        type: 'object',
        properties: {
          rules: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                patterns: {
                  type: 'array',
                  items: {
                    type: 'string',
                  },
                },
                flags: {
                  type: 'string',
                },
                message: {
                  type: 'string',
                },
                replaceWith: {
                  type: 'string',
                },
              },
            },
          },
        },
        additionalProperties: false,
      },
    ],
    type: 'problem' as const,
    fixable: 'code' as const,
  },

  defaultOptions: [],

  create: function (context) {
    const {
      options: [option],
    } = context
    if (!option?.rules?.length) {
      return {}
    }

    const { rules } = option

    const rulePatterns: RegexRule[] = rules.map(
      ({ patterns, message, flags, replaceWith }: RestrictionRule) => ({
        patterns: patterns.map((item: string) => new RegExp(item, flags)),
        message,
        replaceWith,
      }),
    )

    return {
      [`${LinguiTaggedTemplateExpressionMessageQuery}, ${LinguiCallExpressionMessageQuery}, ${LinguiTransQuery} JSXText`](
        node: TSESTree.TemplateLiteral | TSESTree.Literal,
      ) {
        const text = getText(node)

        rulePatterns.forEach(({ patterns, message, replaceWith }: RegexRule) => {
          const matchingPattern = patterns.find((item: RegExp) => item.test(text))
          if (matchingPattern) {
            context.report({
              node,
              messageId: 'default',
              data: { message: message },
              fix: replaceWith !== undefined ? (fixer) => {
                // We only want to replace the content, not the surrounding syntax elements
                let fixedText = text;

                // Create a new regex with the global flag if needed
                if (!matchingPattern.flags.includes('g')) {
                  const globalPattern = new RegExp(matchingPattern.source, matchingPattern.flags + 'g');
                  fixedText = fixedText.replace(globalPattern, replaceWith);
                } else {
                  fixedText = fixedText.replace(matchingPattern, replaceWith);
                }

                // For template literals, JSX elements, and string literals,
                // we need to preserve the original structure
                return fixer.replaceText(node, fixedText);
              } : undefined
            })
          }
        })

        return
      },
    }
  },
})
