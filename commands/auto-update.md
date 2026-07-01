---
description: Pull the latest ECC repo changes and reinstall the current managed targets.
disable-model-invocation: true
---

# Auto Update

Update ECC from its upstream repo and regenerate the current context's managed install using the original install-state request.

## Usage

```bash
# Preview the update without mutating anything
ECC_ROOT="${CLAUDE_PLUGIN_ROOT:-$(node -e "var r=(function(){var p=require('path'),o=require('os');var e=process.env.CLAUDE_PLUGIN_ROOT;var b=(e&&e.trim())?e.trim():p.join(o.homedir(),'.claude');try{return require(p.join(b,'scripts','lib','resolve-ecc-root')).resolveEccRoot()}catch(x){return b}})();console.log(r)")}"
node "$ECC_ROOT/scripts/auto-update.js" --dry-run

# Update only Cursor-managed files in the current project
node "$ECC_ROOT/scripts/auto-update.js" --target cursor

# Override the ECC repo root explicitly
node "$ECC_ROOT/scripts/auto-update.js" --repo-root /path/to/everything-claude-code
```

## Notes

- This command uses the recorded install-state request and reruns `install-apply.js` after pulling the latest repo changes.
- Reinstall is intentional: it handles upstream renames and deletions that `repair.js` cannot safely reconstruct from stale operations alone.
- Use `--dry-run` first if you want to see the reconstructed reinstall plan before mutating anything.
