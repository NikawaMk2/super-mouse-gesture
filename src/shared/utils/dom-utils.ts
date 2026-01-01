/**
 * DOM操作に関するユーティリティ関数
 */

/**
 * EventTargetからHTMLElementを安全に取得する
 * 
 * event.targetはEventTarget型であり、必ずしもHTMLElementではない。
 * 例えば、TextノードやSVGElementなどがevent.targetになる可能性がある。
 * この関数は、event.targetがHTMLElementの場合はそのまま返し、
 * そうでない場合は親要素を探してHTMLElementを返す。
 * 
 * @param target EventTarget（通常はevent.target）
 * @returns HTMLElement、または見つからない場合はnull
 * 
 * @example
 * ```typescript
 * function handleEvent(event: MouseEvent): void {
 *   const element = getHTMLElementFromEventTarget(event.target);
 *   if (!element) {
 *     return;
 *   }
 *   // elementはHTMLElementとして安全に使用できる
 *   const tagName = element.tagName.toLowerCase();
 * }
 * ```
 */
export function getHTMLElementFromEventTarget(
  target: EventTarget | null
): HTMLElement | null {
  if (!target) {
    return null;
  }

  // HTMLElementの場合はそのまま返す
  if (target instanceof HTMLElement) {
    return target;
  }

  // Nodeの場合は親要素を探す
  if (target instanceof Node && target.parentElement) {
    return target.parentElement;
  }

  return null;
}

