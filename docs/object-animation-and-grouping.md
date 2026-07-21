# Object Animation And Grouping

> **Canonical runtime contract:** the full mandatory animation production rules are now inlined in `SKILL.md` under **「动画硬约束（必须内联执行，不得只“参考文档”）」**.  
> This file is the detailed English backup. Agents must execute the SKILL inline section; do not treat a soft route mention as optional reading.  
> **Proactive default:** Agents must add object animations by default in `editable`/`hybrid` without waiting for the user to request them. See `SKILL.md` **默认模式与自觉动画策略（强制）**.
> **Critical:** object animation only works in `editable` / `hybrid` modes via `@bapunhansdah/pptxgenjs@1.1.3` + `notrat-ppt.py animate`. Image-mode `assemble` can only produce full-slide bitmaps and optional page transitions — never object timing.

**Default reading rule:** for normal PPT tasks (editable/hybrid), treat this document as part of the mandatory production path, not an optional appendix. Agents must proactively plan and write object animations even when the user never says the word "animation".

Read this whenever producing editable or hybrid decks (the default), or whenever the deck needs timed sequences, exit effects, emphasis, motion paths, or animation of a multi-object component as one unit.

## Production Backend

Use `@bapunhansdah/pptxgenjs@1.1.3` for native-object animation generation. The standard `pptxgenjs` package does not provide this animation surface.

```bash
npm install @bapunhansdah/pptxgenjs@1.1.3
```

```js
const PptxGenJS = require('@bapunhansdah/pptxgenjs');
```

Pin the version. This is a third-party fork, and animation OOXML is sensitive to implementation changes.

## Capability Matrix

### Entrance

`appear`, `fadein`, `flyin`, `floatin`, `split`, `wipe`, `shape`, `wheel`, `randombars`, `zoom`, `growandturn`, `swivel`, `bounce`

### Emphasis

`pulse`, `colorpulse`, `teeter`, `spin`, `growshrink`, `desaturate`, `darken`, `lighten`, `transparency`, `objectcolor`, `complementarycolor`, `linecolor`, `fillcolor`

### Exit

`disappear`, `fadeout`, `flyout`, `floatout`, `splitexit`, `wipeexit`, `shapeexit`, `wheelexit`, `randombarsexit`, `shrinkandturn`, `zoomexit`, `swivelexit`, `bounceexit`

### Motion Path

`pathdown`, `patharcdown`, `pathturnright`, `pathcircle`, `pathzigzag`

### Timing

- `trigger: 'onClick'`: starts a click step.
- `trigger: 'withPrevious'`: starts in parallel with the previous effect.
- `trigger: 'afterPrevious'`: starts after the previous effect.
- `delay`: milliseconds after the trigger condition.
- `duration`: milliseconds for the effect.

The fork does not expose repeat, auto-reverse, media-style looping, arbitrary Bézier paths, or event triggers such as `onShapeClick`. Treat these as unsupported until a PowerPoint-authored OOXML reference and playback test are available.

## Basic Declaration

```js
slide.addText('Section title', {
  x: 0.7, y: 0.5, w: 5.5, h: 0.6,
  fontSize: 30,
  animation: {
    type: 'fadein',
    duration: 550,
    delay: 0,
    trigger: 'afterPrevious'
  }
});

slide.addShape(pptx.ShapeType.roundRect, {
  x: 1, y: 2, w: 3.2, h: 1.4,
  animation: {
    type: 'flyout',
    direction: 'right',
    duration: 650,
    delay: 1200,
    trigger: 'afterPrevious'
  }
});
```

Useful option families:

- Fly: `top`, `bottom`, `left`, `right`, and diagonal variants.
- Split: `horizontalIn`, `horizontalOut`, `verticalIn`, `verticalOut`.
- Wipe: `top`, `bottom`, `left`, `right`.
- Shape: `shape: 'circle' | 'box' | 'diamond' | 'plus'`, `direction: 'in' | 'out'`.
- Wheel: `spokes: 1 | 2 | 3 | 4 | 8`.
- Zoom: `slideCenter`, `objectCenter`.
- Spin: direction and quarter/half/full/two-spin amounts.
- Color effects: provide a six-digit RGB `color`.
- Transparency: `level: 25 | 50 | 75 | 100`.

Do not use unsupported aliases such as `type: 'fly'`. Use the exact names above.

## Animation Design Rules

Animation is part of information hierarchy, not decoration.

- Animate semantic components, not every primitive shape.
- Prefer 3-7 meaningful animation steps per slide.
- Use entrance effects for reveal, emphasis for focus, exit only when removal communicates a state change, and motion paths only when movement itself explains a process.
- Keep routine entrance effects around 350-700 ms. Use 700-1200 ms for deliberate motion paths. Avoid long chains that make the presenter wait.
- Use one click to reveal one idea. Put related objects on `withPrevious` or group them.
- Avoid assigning a default fly-in to every object. Backgrounds, separators, borders, and decorative lines normally stay static.
- Exit effects should have a reason: replacement, progression, or clearing the stage for the next state.

## Multi-Effect Sequences

The fork accepts one `animation` property per object. For `entrance -> emphasis -> path -> exit` on the same target, use the bundled OOXML postprocessing pattern:

1. Give the target or target group a stable `objectName`.
2. Create one invisible proxy shape for each effect.
3. Generate the raw PPTX.
4. Retarget every proxy's `p:spTgt/@spid` to the real target ID.
5. Remove proxy shapes.
6. Repack and validate the PPTX.

Naming convention used by the reference implementation:

```text
grp:<group>:anchor
grp:<group>:member:<name>
anim-proxy:<group>:<sequence-number>
```

Example sequence:

```js
proxy(1, { type: 'fadein', duration: 650, trigger: 'afterPrevious' });
proxy(2, { type: 'pulse', duration: 520, delay: 900, trigger: 'afterPrevious' });
proxy(3, { type: 'patharcdown', duration: 900, delay: 250, trigger: 'afterPrevious' });
proxy(4, { type: 'fadeout', duration: 600, delay: 1100, trigger: 'afterPrevious' });
```

The sequence order is the object order in the slide timing list. `delay` does not replace sequence order.

## True Group Animation

PptxGenJS does not expose a general group API. Merely giving several objects the same timing does not create a PowerPoint group and still produces multiple animation entries.

For a true editable group:

1. Identify member shapes by stable `objectName` values.
2. Compute the union bounding box from each member's `a:xfrm`.
3. Create `p:grpSp` with `p:nvGrpSpPr`, `p:grpSpPr`, and `a:xfrm`.
4. Set group `off/ext` to the union bounds.
5. Set `chOff/chExt` to the same coordinate system so child positions remain unchanged.
6. Move the existing `p:sp` / `p:pic` nodes under the group without flattening them.
7. Assign a new unique shape ID to the group's `p:cNvPr`.
8. Retarget timing nodes to the group ID.

This preserves editable child objects while presenting one animation target in PowerPoint.

Reference implementation in this workspace:

- `scripts/notrat-ppt.py animate`
- `notrat-video-ppt/animation_capability_lab.js`
- `scripts/notrat-ppt.py validate`

Keep the raw PPTX. Never overwrite the last known-good deck during OOXML postprocessing.

## OOXML Structures

Animations live in `ppt/slides/slideN.xml` under:

```xml
<p:timing>
  <p:tnLst>
    <p:par>
      <p:cTn nodeType="tmRoot">
        ... main sequence ...
      </p:cTn>
    </p:par>
  </p:tnLst>
</p:timing>
```

Important nodes and attributes:

- `p:cTn/@presetClass`: `entr`, `emph`, `exit`, or `path`.
- `p:cTn/@presetID` and `@presetSubtype`: PowerPoint effect identifiers.
- `p:cTn/@nodeType`: commonly `clickEffect`, `withEffect`, `afterEffect`.
- `p:cond/@delay`: delay in milliseconds.
- Child behavior `p:cTn/@dur`: effect duration in milliseconds.
- `p:spTgt/@spid`: target shape or group ID.
- `p:animEffect`: filter-based entrance/exit effects.
- `p:animMotion`: motion path behavior.
- `p:anim`, `p:animScale`, `p:animRot`, `p:set`: property, scale, rotation, and visibility behaviors.

Do not hand-edit preset IDs without a PowerPoint-authored reference or a tested generator mapping.

## Validation Gate

Run structural validation after every animation build:

```bash
python scripts/notrat-ppt.py animate raw.pptx grouped.pptx
python scripts/notrat-ppt.py validate grouped.pptx
```

Required structural checks:

- ZIP package passes `ZipFile.testzip()`.
- Every `p:spTgt/@spid` resolves to a `p:cNvPr/@id` on the same slide.
- Shape IDs are unique per slide.
- Every expected slide contains `p:timing`.
- Expected `presetClass` values are present.
- Proxy shapes are gone after postprocessing.
- Expected `p:grpSp` objects exist.
- No source relationship or media file is lost during repacking.

Structural validity is not playback validation. Before delivery, open in desktop Microsoft PowerPoint, play every slide, save a copy, reopen it, and confirm there is no repair prompt. When WPS support matters, repeat in the target WPS version. LibreOffice should be treated as best-effort because it may ignore or rewrite PowerPoint timing trees.

## Compatibility And Limits

- Microsoft PowerPoint desktop is the reference renderer.
- PowerPoint Web may simplify effects or timing.
- WPS compatibility varies by effect and version; basic fade/fly/wipe are safer than complex emphasis and path effects.
- LibreOffice Impress has incomplete PowerPoint animation fidelity and may drop advanced timing on save.
- A structurally valid PPTX can still play differently across viewers.
- Group conversion changes selection behavior: users select the group first, then enter the group to edit children.
- Some effects generated by the fork use generic preset XML rather than a byte-for-byte PowerPoint-authored template. Validate visually.
- This method does not create morph transitions. Morph is a slide transition and separate from object timing.

## Tested Reference Result

The workspace test deck `animation_capability_lab_grouped.pptx` has been structurally verified with:

- 3 slides with timing trees.
- `entr`, `emph`, `exit`, and `path` preset classes.
- 5 `p:animMotion` path behaviors.
- One true `p:grpSp` group.
- Four proxy effects retargeted to that group.
- No remaining proxy objects.
- No missing animation target IDs.
- No ZIP package error.

Playback was not validated on the development machine because PowerPoint COM, WPS, and LibreOffice were unavailable. Report that limitation rather than claiming full compatibility.


