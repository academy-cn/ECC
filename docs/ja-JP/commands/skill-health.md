---
name: skill-health
description: チャートとアナリティクス付きのスキルポートフォリオヘルスダッシュボードを表示
command: true
---

# スキルヘルスダッシュボード

ポートフォリオ内のすべてのスキルについて、成功率スパークライン、失敗パターンのクラスタリング、保留中の修正案、バージョン履歴を含む包括的なヘルスダッシュボードを表示します。

## 実装

ダッシュボードモードでスキルヘルスCLIを実行:

```bash
ECC_ROOT="${CLAUDE_PLUGIN_ROOT:-$(node -e "var r=(function(){var p=require('path'),o=require('os');var e=process.env.CLAUDE_PLUGIN_ROOT;var b=(e&&e.trim())?e.trim():p.join(o.homedir(),'.claude');try{return require(p.join(b,'scripts','lib','resolve-ecc-root')).resolveEccRoot()}catch(x){return b}})();console.log(r)")}"
node "$ECC_ROOT/scripts/skills-health.js" --dashboard
```

特定のパネルのみ:

```bash
ECC_ROOT="${CLAUDE_PLUGIN_ROOT:-$(node -e "var r=(function(){var p=require('path'),o=require('os');var e=process.env.CLAUDE_PLUGIN_ROOT;var b=(e&&e.trim())?e.trim():p.join(o.homedir(),'.claude');try{return require(p.join(b,'scripts','lib','resolve-ecc-root')).resolveEccRoot()}catch(x){return b}})();console.log(r)")}"
node "$ECC_ROOT/scripts/skills-health.js" --dashboard --panel failures
```

機械読み取り可能な出力:

```bash
ECC_ROOT="${CLAUDE_PLUGIN_ROOT:-$(node -e "var r=(function(){var p=require('path'),o=require('os');var e=process.env.CLAUDE_PLUGIN_ROOT;var b=(e&&e.trim())?e.trim():p.join(o.homedir(),'.claude');try{return require(p.join(b,'scripts','lib','resolve-ecc-root')).resolveEccRoot()}catch(x){return b}})();console.log(r)")}"
node "$ECC_ROOT/scripts/skills-health.js" --dashboard --json
```

## 使い方

```
/skill-health                    # フルダッシュボードビュー
/skill-health --panel failures   # 失敗クラスタリングパネルのみ
/skill-health --json             # 機械読み取り可能なJSON出力
```

## 動作内容

1. --dashboardフラグでskills-health.jsスクリプトを実行
2. ユーザーに出力を表示
3. 低下しているスキルがある場合、ハイライトして/evolveの実行を提案
4. 保留中の修正案がある場合、レビューを提案

## パネル

- **成功率（30日）** — スキルごとの日次成功率を表示するスパークラインチャート
- **失敗パターン** — 水平バーチャート付きのクラスタ化された失敗理由
- **保留中の修正案** — レビュー待ちの修正提案
- **バージョン履歴** — スキルごとのバージョンスナップショットのタイムライン
