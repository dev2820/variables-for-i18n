export const copyContentOfNode = (selector: string) => {
  const resultNode = document.querySelector(selector);
  const range = new Range();
  range.setStart(resultNode, 0);
  range.setEnd(resultNode, resultNode.childNodes.length);
  document.getSelection().removeAllRanges();
  document.getSelection().addRange(range);
  document.execCommand('copy');
  document.getSelection().removeAllRanges();
};
