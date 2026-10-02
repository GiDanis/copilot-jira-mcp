/**
 * Atlassian Document Format (ADF) <-> Markdown converter
 */

/**
 * Converts an ADF node or tree into clean Markdown text.
 * @param {any} node - The ADF node (doc, paragraph, text, etc.)
 * @returns {string} - Formatted Markdown
 */
export function adfToMarkdown(node) {
  if (!node) return '';
  if (typeof node === 'string') return node;

  switch (node.type) {
    case 'doc':
      return (node.content || [])
        .map(adfToMarkdown)
        .filter(Boolean)
        .join('\n\n')
        .trim();

    case 'paragraph':
      return (node.content || []).map(adfToMarkdown).join('');

    case 'text': {
      let text = node.text || '';
      if (!node.marks || node.marks.length === 0) {
        return text;
      }

      // Apply marks in order
      for (const mark of node.marks) {
        switch (mark.type) {
          case 'strong':
            text = `**${text}**`;
            break;
          case 'em':
            text = `*${text}*`;
            break;
          case 'strike':
            text = `~~${text}~~`;
            break;
          case 'code':
            text = `\`${text}\``;
            break;
          case 'link':
            text = `[${text}](${mark.attrs?.href || ''})`;
            break;
          case 'underline':
            text = `<u>${text}</u>`;
            break;
          default:
            break;
        }
      }
      return text;
    }

    case 'heading': {
      const level = Math.min(Math.max(node.attrs?.level || 1, 1), 6);
      const prefix = '#'.repeat(level) + ' ';
      const content = (node.content || []).map(adfToMarkdown).join('');
      return `${prefix}${content}`;
    }

    case 'bulletList':
      return (node.content || [])
        .map((item) => `- ${adfToMarkdown(item).trim()}`)
        .join('\n');

    case 'orderedList':
      return (node.content || [])
        .map((item, index) => `${index + 1}. ${adfToMarkdown(item).trim()}`)
        .join('\n');

    case 'listItem':
      return (node.content || [])
        .map(adfToMarkdown)
        .filter(Boolean)
        .join('\n  ');

    case 'codeBlock': {
      const lang = node.attrs?.language || '';
      const content = (node.content || []).map((c) => c.text || '').join('');
      return `\`\`\`${lang}\n${content}\n\`\`\``;
    }

    case 'blockquote': {
      const content = (node.content || []).map(adfToMarkdown).join('\n');
      return content
        .split('\n')
        .map((line) => `> ${line}`)
        .join('\n');
    }

    case 'rule':
      return '---';

    case 'hardBreak':
      return '\n';

    case 'mention':
      return `@${node.attrs?.text || node.attrs?.id || 'user'}`;

    case 'emoji':
      return node.attrs?.shortName || node.attrs?.text || '';

    case 'inlineCard':
    case 'blockCard':
      return node.attrs?.url ? `[${node.attrs.url}](${node.attrs.url})` : '';

    case 'table':
      return renderTable(node);

    default:
      if (node.content && Array.isArray(node.content)) {
        return node.content.map(adfToMarkdown).join('');
      }
      if (node.text) {
        return node.text;
      }
      return '';
  }
}

/**
 * Renders an ADF table node to a Markdown table
 */
function renderTable(tableNode) {
  if (!tableNode.content || tableNode.content.length === 0) return '';

  const rows = [];
  for (const rowNode of tableNode.content) {
    if (rowNode.type !== 'tableRow' || !rowNode.content) continue;
    const cells = rowNode.content.map((cellNode) => {
      const cellContent = (cellNode.content || []).map(adfToMarkdown).join(' ').trim();
      return cellContent.replace(/\|/g, '\\|').replace(/\n/g, ' ');
    });
    rows.push(cells);
  }

  if (rows.length === 0) return '';

  const colCount = Math.max(...rows.map((r) => r.length));
  // Pad cells
  const normalizedRows = rows.map((row) => {
    while (row.length < colCount) row.push('');
    return row;
  });

  const header = `| ${normalizedRows[0].join(' | ')} |`;
  const separator = `| ${normalizedRows[0].map(() => '---').join(' | ')} |`;
  const body = normalizedRows
    .slice(1)
    .map((row) => `| ${row.join(' | ')} |`)
    .join('\n');

  return body ? `${header}\n${separator}\n${body}` : `${header}\n${separator}`;
}

/**
 * Converts a plain text or Markdown string into an ADF doc object for Jira REST API v3
 * @param {string | object} input - Text to convert or existing ADF object
 * @returns {object} - ADF doc node
 */
export function textToADF(input) {
  if (!input) {
    return {
      type: 'doc',
      version: 1,
      content: [],
    };
  }

  // Already an ADF document
  if (typeof input === 'object' && input.type === 'doc') {
    return input;
  }

  const str = String(input).trim();
  if (!str) {
    return {
      type: 'doc',
      version: 1,
      content: [],
    };
  }

  // Split into paragraphs by blank lines
  const paragraphs = str.split(/\n{2,}/);
  const content = [];

  for (const p of paragraphs) {
    const trimmed = p.trim();
    if (!trimmed) continue;

    // Check if it looks like a list item
    const lines = trimmed.split('\n');
    const isBulletList = lines.every((line) => line.trim().startsWith('- ') || line.trim().startsWith('* '));
    
    if (isBulletList && lines.length > 0) {
      content.push({
        type: 'bulletList',
        content: lines.map((line) => ({
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: line.trim().replace(/^[-*]\s+/, ''),
                },
              ],
            },
          ],
        })),
      });
      continue;
    }

    // Default paragraph with hard breaks if multi-line
    const paragraphContent = [];
    lines.forEach((line, index) => {
      if (line) {
        paragraphContent.push({
          type: 'text',
          text: line,
        });
      }
      if (index < lines.length - 1) {
        paragraphContent.push({
          type: 'hardBreak',
        });
      }
    });

    if (paragraphContent.length > 0) {
      content.push({
        type: 'paragraph',
        content: paragraphContent,
      });
    }
  }

  return {
    type: 'doc',
    version: 1,
    content: content.length > 0 ? content : [
      {
        type: 'paragraph',
        content: [{ type: 'text', text: str }],
      },
    ],
  };
}
