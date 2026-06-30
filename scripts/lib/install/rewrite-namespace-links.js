'use strict';

// The Claude home/project installers inject a namespace segment into the
// destination layout: `skills/` -> `skills/<ns>/` and `rules/` -> `rules/<ns>/`.
// Skills that link to a sibling top-level dir using a source-relative path
// (e.g. `../../rules/react/hooks.md`) break after install, because the extra
// `<ns>/` level changes what `../../` resolves to and the target dir is itself
// namespaced.
//
// This rewrites such links so they remain valid post-install: prepend one `../`
// (to climb out of the injected namespace level) and insert the namespace
// segment after the managed top-level dir name. Only links that climb with at
// least two `../` and reference a namespaced managed dir (`rules`/`skills`) are
// touched; intra-skill links (a single `../`) and absolute/bare paths are left
// alone.

const NAMESPACED_DIRS = ['rules', 'skills'];

function buildLinkPattern() {
  const dirs = NAMESPACED_DIRS.join('|');
  // group 1: the `../` climb (>= 2), group 2: managed dir, group 3: trailing `/`
  return new RegExp(`((?:\\.\\./){2,})(${dirs})(/)`, 'g');
}

/**
 * Rewrite source-relative links in a namespaced skill/rule markdown file so they
 * resolve correctly after the installer injects `<namespace>/`.
 * @param {string} content - file contents
 * @param {string} namespace - injected namespace segment (e.g. "ecc")
 * @returns {string} rewritten contents (unchanged if no matching links)
 */
function rewriteNamespaceLinks(content, namespace) {
  if (typeof content !== 'string' || !namespace) {
    return content;
  }

  const pattern = buildLinkPattern();
  return content.replace(pattern, (match, climb, dir, slash, offset, fullText) => {
    // Already namespaced (`../../rules/ecc/...`) — leave untouched (idempotent).
    const rest = fullText.slice(offset + match.length);
    if (rest.startsWith(`${namespace}/`)) {
      return match;
    }
    return `../${climb}${dir}${slash}${namespace}/`;
  });
}

module.exports = { rewriteNamespaceLinks, NAMESPACED_DIRS };
