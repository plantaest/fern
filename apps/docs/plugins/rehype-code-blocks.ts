type Node = {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: Node[];
};

export default function rehypeCodeBlocks() {
  return function transform(node: Node) {
    const code = node.children?.[0];
    const text = code?.children?.[0];

    if (
      node.type === 'element' &&
      node.tagName === 'pre' &&
      code?.tagName === 'code' &&
      text?.type === 'text' &&
      typeof text.value === 'string'
    ) {
      const classes = code.properties?.className;
      const language = Array.isArray(classes)
        ? classes.find(
            (value): value is string => typeof value === 'string' && value.startsWith('language-'),
          )
        : undefined;

      node.tagName = 'code-block';
      node.properties = {
        // Markdown adds one final newline; preserve the authored content.
        code: text.value.replace(/\n$/, ''),
        language: language?.slice('language-'.length) ?? 'text',
      };
      node.children = [];

      return;
    }

    for (const child of node.children ?? []) {
      transform(child);
    }
  };
}
