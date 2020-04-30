export class MarkdownNunjucksExtension {
  tags = ['markdown'];
  parse(parser: any, nodes: any) {
    const startToken = parser.nextToken();
    /**解析标签参数 */
    const args = parser.parseSignature(null, true);
    // Jump to the end of the "{% highlight }" block.
    parser.advanceAfterBlockEnd(startToken.value);
    // Parse text content until {% end_highlight }" has been reached.
    const textContent = parser.parseUntilBlocks('end_markdown');
    // Jump to the end of the "{% highlight }" block.
    parser.advanceAfterBlockEnd();
    return new nodes.CallExtension(this, 'render', args, [textContent]);
  }

  render(_context: any, /**参数 */ markdownPath: string, /**内容函数 */ contentFn: () => string) {
    // return highlightCodeBlock(contentFn(), language);
    const content = contentFn();
    console.log(_context, markdownPath, contentFn);
  }
}
