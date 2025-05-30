require('dotenv').config();

module.exports = {
  overwrite: true,
  schema: [
    {
      [`https://${process.env.SWELL_STORE_ID}.swell.store/graphql`]: {
        headers: {
          Authorization: process.env.SWELL_PUBLIC_KEY
        }
      }
    }
  ],
  documents: 'lib/**/*.graphql',
  generates: {
    'lib/swell/__generated__/graphql.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-graphql-request',
        { add: { content: '// @ts-nocheck' } }
      ],
      config: {
        preResolveTypes: false,
        maybeValue: 'T',
        inputMaybeValue: 'T | undefined',
        rawRequest: true,
        avoidOptionals: {
          field: true,
          inputValue: true,
          object: true,
          defaultValue: true
        }
      }
    }
  }
};
