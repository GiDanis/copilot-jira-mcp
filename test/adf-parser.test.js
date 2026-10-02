import test from 'node:test';
import assert from 'node:assert/strict';
import { adfToMarkdown, textToADF } from '../src/adf-parser.js';

test('adfToMarkdown handles simple paragraphs with formatting', () => {
  const adf = {
    type: 'doc',
    version: 1,
    content: [
      {
        type: 'paragraph',
        content: [
          { type: 'text', text: 'Hello ' },
          { type: 'text', text: 'world', marks: [{ type: 'strong' }] },
          { type: 'text', text: ' and ' },
          { type: 'text', text: 'code', marks: [{ type: 'code' }] },
        ],
      },
    ],
  };

  const md = adfToMarkdown(adf);
  assert.equal(md, 'Hello **world** and `code`');
});

test('adfToMarkdown handles headings, bullet lists and blockquotes', () => {
  const adf = {
    type: 'doc',
    version: 1,
    content: [
      {
        type: 'heading',
        attrs: { level: 2 },
        content: [{ type: 'text', text: 'Section Title' }],
      },
      {
        type: 'bulletList',
        content: [
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: 'Item 1' }],
              },
            ],
          },
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: 'Item 2' }],
              },
            ],
          },
        ],
      },
      {
        type: 'blockquote',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Quoted text' }],
          },
        ],
      },
    ],
  };

  const md = adfToMarkdown(adf);
  assert.match(md, /## Section Title/);
  assert.match(md, /- Item 1/);
  assert.match(md, /- Item 2/);
  assert.match(md, /> Quoted text/);
});

test('adfToMarkdown handles code blocks', () => {
  const adf = {
    type: 'doc',
    version: 1,
    content: [
      {
        type: 'codeBlock',
        attrs: { language: 'javascript' },
        content: [{ type: 'text', text: 'console.log("hello");' }],
      },
    ],
  };

  const md = adfToMarkdown(adf);
  assert.equal(md, '```javascript\nconsole.log("hello");\n```');
});

test('adfToMarkdown handles links and mentions', () => {
  const adf = {
    type: 'doc',
    version: 1,
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Jira issue',
            marks: [{ type: 'link', attrs: { href: 'https://example.atlassian.net' } }],
          },
          { type: 'text', text: ' mentioned ' },
          {
            type: 'mention',
            attrs: { text: 'giuseppe' },
          },
        ],
      },
    ],
  };

  const md = adfToMarkdown(adf);
  assert.equal(md, '[Jira issue](https://example.atlassian.net) mentioned @giuseppe');
});

test('textToADF creates a valid ADF document', () => {
  const text = 'Paragraph 1\n\nParagraph 2';
  const adf = textToADF(text);

  assert.equal(adf.type, 'doc');
  assert.equal(adf.version, 1);
  assert.equal(adf.content.length, 2);
  assert.equal(adf.content[0].type, 'paragraph');
  assert.equal(adf.content[0].content[0].text, 'Paragraph 1');
  assert.equal(adf.content[1].content[0].text, 'Paragraph 2');
});

test('textToADF creates bullet lists from markdown-style list', () => {
  const text = '- First bullet\n- Second bullet';
  const adf = textToADF(text);

  assert.equal(adf.type, 'doc');
  assert.equal(adf.content[0].type, 'bulletList');
  assert.equal(adf.content[0].content.length, 2);
  assert.equal(adf.content[0].content[0].content[0].content[0].text, 'First bullet');
});
