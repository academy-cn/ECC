---
description: Show learned instincts (project + global) with confidence
agent: everything-claude-code:build
---

# Instinct Status Command

Show instinct status from continuous-learning-v2: $ARGUMENTS

## Your Task

Resolve the active ECC plugin root with the same walker `hooks/hooks.json`
uses (env var → standard install → known plugin roots → plugin cache →
fallback), then run the instinct CLI. This avoids reading a stale legacy
`~/.claude/skills/continuous-learning-v2/` install when the plugin is
active under `~/.claude/plugins/cache/...` (#2037).

```bash
ECC_ROOT="${CLAUDE_PLUGIN_ROOT:-$(node -e "var r=(function(){var p=require('path'),o=require('os');var e=process.env.CLAUDE_PLUGIN_ROOT;var b=(e&&e.trim())?e.trim():p.join(o.homedir(),'.claude');try{return require(p.join(b,'scripts','lib','resolve-ecc-root')).resolveEccRoot()}catch(x){return b}})();console.log(r)")}"
python3 "$ECC_ROOT/skills/continuous-learning-v2/scripts/instinct-cli.py" status
```

## Behavior Notes

- Output includes both project-scoped and global instincts.
- Project instincts override global instincts when IDs conflict.
- Output is grouped by domain with confidence bars.
- This command does not support extra filters in v2.1.
