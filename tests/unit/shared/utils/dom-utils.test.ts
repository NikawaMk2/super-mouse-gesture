/**
 * dom-utils.ts のユニットテスト
 */
import { getHTMLElementFromEventTarget } from '@/shared/utils/dom-utils';

describe('getHTMLElementFromEventTarget', () => {
  it('targetがnullの場合_nullを返すこと', () => {
    const result = getHTMLElementFromEventTarget(null);
    expect(result).toBeNull();
  });

  it('targetがHTMLElementの場合_そのまま返すこと', () => {
    const element = document.createElement('div');
    const result = getHTMLElementFromEventTarget(element);
    expect(result).toBe(element);
    expect(result).toBeInstanceOf(HTMLElement);
  });

  it('targetがTextノードでparentElementがある場合_parentElementを返すこと', () => {
    const parent = document.createElement('div');
    const textNode = document.createTextNode('test');
    parent.appendChild(textNode);

    const result = getHTMLElementFromEventTarget(textNode);
    expect(result).toBe(parent);
    expect(result).toBeInstanceOf(HTMLElement);
  });

  it('targetがTextノードでparentElementがnullの場合_nullを返すこと', () => {
    const textNode = document.createTextNode('test');
    // parentElementを削除するために、親から切り離す
    if (textNode.parentNode) {
      textNode.parentNode.removeChild(textNode);
    }

    const result = getHTMLElementFromEventTarget(textNode);
    expect(result).toBeNull();
  });

  it('targetがCommentノードでparentElementがある場合_parentElementを返すこと', () => {
    const parent = document.createElement('div');
    const commentNode = document.createComment('test comment');
    parent.appendChild(commentNode);

    const result = getHTMLElementFromEventTarget(commentNode);
    expect(result).toBe(parent);
    expect(result).toBeInstanceOf(HTMLElement);
  });

  it('targetがSVGElementの場合_親要素を探してHTMLElementを返すこと', () => {
    const parent = document.createElement('div');
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    parent.appendChild(svg);

    // SVGElementはHTMLElementではないが、Elementのサブクラス
    // parentElementプロパティがある場合はそれを返す
    const result = getHTMLElementFromEventTarget(svg);
    // SVGElementはElementのサブクラスなので、parentElementがある場合はそれを返す
    if (svg.parentElement) {
      expect(result).toBe(svg.parentElement);
    } else {
      expect(result).toBeNull();
    }
  });

  it('targetがSVGElementでparentElementがnullの場合_nullを返すこと', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    // 親要素がない状態にする
    if (svg.parentNode) {
      svg.parentNode.removeChild(svg);
    }

    const result = getHTMLElementFromEventTarget(svg);
    expect(result).toBeNull();
  });

  it('targetがDocumentFragmentの場合_nullを返すこと', () => {
    const fragment = document.createDocumentFragment();
    const result = getHTMLElementFromEventTarget(fragment);
    // DocumentFragmentはNodeだが、parentElementプロパティがない
    expect(result).toBeNull();
  });

  it('targetがDocumentの場合_nullを返すこと', () => {
    const result = getHTMLElementFromEventTarget(document);
    // DocumentはNodeだが、parentElementプロパティがない
    expect(result).toBeNull();
  });

  it('targetがHTMLElementの子要素の場合_そのまま返すこと', () => {
    const parent = document.createElement('div');
    const child = document.createElement('span');
    parent.appendChild(child);

    const result = getHTMLElementFromEventTarget(child);
    expect(result).toBe(child);
    expect(result).toBeInstanceOf(HTMLElement);
  });

  it('targetがネストされたTextノードの場合_親のHTMLElementを返すこと', () => {
    const grandParent = document.createElement('div');
    const parent = document.createElement('p');
    const textNode = document.createTextNode('nested text');
    grandParent.appendChild(parent);
    parent.appendChild(textNode);

    const result = getHTMLElementFromEventTarget(textNode);
    expect(result).toBe(parent);
    expect(result).toBeInstanceOf(HTMLElement);
  });
});

