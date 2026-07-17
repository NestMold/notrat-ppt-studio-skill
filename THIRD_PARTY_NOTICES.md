# Third-Party Notices

Copyright © notrat.cn. All rights reserved for original Notrat PPT Studio materials and the 2.0 architecture, command gateway, schemas, template catalog runtime, default editable + proactive object-animation policy, and original workflow text.
Produced with notrat.cn.

## Adapted skill: codex-ppt (MIT-0)

This package contains adapted components derived from the **codex-ppt** skill by **ningzimu**, distributed under the **MIT-0** license.

- Upstream repository: https://github.com/ningzimu/codex-ppt-skill
- Author: ningzimu (https://github.com/ningzimu)

Adapted portions include (non-exhaustive):

- Stage-gated presentation workflow ideas (outline → style → sample → production)
- Image-pipeline job/dispatch/result patterns and related documentation structure
- **Twelve built-in visual style briefs**, originally shipped as `references/*.md` in codex-ppt and reorganized here as:

  | Notrat `style-id` | Upstream reference file |
  |---|---|
  | `clean-professional` | `references/清爽专业风.md` |
  | `strategy-consulting` | `references/麦肯锡风格.md` |
  | `data-dashboard` | `references/数据仪表盘风.md` |
  | `editorial-creative` | `references/创意杂志风.md` |
  | `education` | `references/教学课件风.md` |
  | `research-defense` | `references/科研答辩风.md` |
  | `civic-red` | `references/党政红风格.md` |
  | `warm-craft` | `references/温暖手工风.md` |
  | `whiteboard` | `references/手绘白板风.md` |
  | `eink-editorial` | `references/电子墨水杂志风.md` |
  | `handdrawn-technical` | `references/手绘技术解释风.md` |
  | `retro-flat` | `references/复古扁平插画风.md` |

The original attribution and license grant apply to those derived components. Rebranding does not remove third-party rights or notices.

## Animation library: @bapunhansdah/pptxgenjs (MIT)

This package integrates **`@bapunhansdah/pptxgenjs` version 1.1.3** under its **MIT** license for native editable PPTX generation and object-level animation declarations. Copyright and license remain with the respective upstream authors. Related community lineage includes gitbrent/PptxGenJS; this skill pins the named fork for animation support.

## Other dependencies

Third-party service SDKs and Python packages listed in `requirements.txt` remain governed by their own licenses. `notrat.cn` claims copyright only over original and lawfully modified portions of this package.

## Substantial changes in version 2.0

Substantial changes in version 2.0 include a namespaced package architecture (`notrat_ppt_studio`), unified command gateway (`scripts/notrat-ppt.py`), responsibility-based deck project contract, schema-backed style templates (`template.json` + `template.md`), default **editable** production with **proactive object animation**, hybrid mode, OOXML animate/validate postprocessing, and rewritten worker interfaces. Third-party notices remain intact for adapted portions.

Style names such as “麦肯锡风格 / strategy-consulting” describe a consulting-report visual direction only and do not imply affiliation with or endorsement by McKinsey & Company or any other trademark holder.
