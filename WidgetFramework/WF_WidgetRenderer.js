// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: magic;
/**
 * WF_WidgetRenderer
 * UTF-8 日本語コメント
 **/
module.exports = class WF_WidgetRenderer {

  constructor(appId, storageType) {
    this.appId = appId
    this.storageType = storageType || "local"

    this.fontCache = {}
    this.styleCache = {}

    this.initStorage()
  }

  // =========================
  // initStorage
  // =========================
  initStorage(){

    switch (this.storageType) {

      case "icloud":
        this.fm = FileManager.iCloud()
        this.baseDir = this.fm.documentsDirectory()
        break

      case "bookmark":
        this.fm = FileManager.local()
        this.baseDir = this.fm.bookmarkedPath("Scriptable")
        break

      default:
        this.fm = FileManager.local()
        this.baseDir = this.fm.documentsDirectory()

    }

    const root = this.fm.joinPath(this.baseDir, "WF_Data")

    this.appRoot = this.fm.joinPath(root, this.appId)
    this.cacheDir = this.fm.joinPath(this.appRoot, "img")

    if (!this.fm.fileExists(root))
      this.fm.createDirectory(root)

    if (!this.fm.fileExists(this.appRoot))
      this.fm.createDirectory(this.appRoot)

    if (!this.fm.fileExists(this.cacheDir))
      this.fm.createDirectory(this.cacheDir)

  }

  // =========================
  // エントリ
  // =========================
  async render(context) {

    context = context || {}

    const widget = new ListWidget()

    const cfg = context.config || {}
    const values = cfg.values || {}
    const layout = cfg.layout || {}

    // layout padding
    if (layout.padding) {
      const p = layout.padding
      widget.setPadding(p.top, p.left, p.bottom, p.right)
    }

    // 背景
    if (values.useBgGradient && values.bgColorTop && values.bgColorBottom) {
      widget.backgroundGradient = await this.setGradientBackground(values.bgColorTop, values.bgColorBottom)
    }
    else if (values.bgColor) {
      try {
        widget.backgroundColor = new Color(String(values.bgColor))
      } catch (e) {
        console.warn("Invalid bgColor: " + values.bgColor)
      }
    }

    //Header
    if (Array.isArray(layout.header) && layout.header.length) {
      await this.renderBlock(widget, layout.header, context)
      // widget.addSpacer()
    }

    // Body
    if (Array.isArray(layout.body) && layout.body.length) {
      await this.renderBlock(widget, layout.body, context)
    }

    // Footer
    if (Array.isArray(layout.footer) && layout.footer.length) {
      widget.addSpacer()
      await this.renderBlock(widget, layout.footer, context)
    }

    return widget
  }

  // =========================
  // ブロック描画
  // =========================
  async renderBlock(container, blocks, context) {
    if (!Array.isArray(blocks)) return

    for (const block of blocks) {
      if (!block || typeof block !== "object") continue

      // show判定
      if (block.show !== undefined && !this.evaluate(block.show, context)) continue

      // hidden判定
      if (block.hidden !== undefined && this.evaluate(block.hidden, context)) continue

      // =========================
      // repeat対応
      // =========================
      if (block.type === "repeat") {

        let items = this.resolveData(block.items, context)
        if (!Array.isArray(items)) items = []

        // filter
        if (block.filter) {
          items = items.filter(item => this.evaluate(block.filter, { ...context, item }))
        }

        // sort
        if (block.sortBy) {
          const key = block.sortBy
          const order = (block.order && this.bind(block.order, context) === "asc") ? 1 : -1
          items = [...items].sort((a, b) => {
            const av = a?.[key], bv = b?.[key]
            if (av === bv) return 0
            if (av === undefined) return 1
            if (bv === undefined) return -1
            return (typeof av === "string" ? av.localeCompare(bv) : Number(av) - Number(bv)) * order
          })
        }

        // limit
        if (block.limit) {
          const limit = Number(this.bind(block.limit, context)) || 0
          items = items.slice(0, limit)
        }

        // empty
        if (items.length === 0 && block.empty) {
          await this.renderElement(container, block.empty, context)
          continue
        }

        // repeat用Stack
        const repeatStack = container.addStack()
        if (block.direction === "vertical") repeatStack.layoutVertically()
        else repeatStack.layoutHorizontally()  // default horizontal

        repeatStack.spacing = block.spacing ?? 6

        // alignContent
        const align = block.align ?? "center"

        if (align === "top") repeatStack.topAlignContent()
        else if (align === "bottom") repeatStack.bottomAlignContent()
        else repeatStack.centerAlignContent()

        // template描画（再帰）
        for (let i = 0; i < items.length; i++) {
          const item = items[i]
          const newCtx = { ...context, item, index: i + 1 }
          if (block.template) await this.renderBlock(repeatStack, [block.template], newCtx)
        }

        continue
      }

      // =========================
      // 通常描画
      // =========================
      await this.renderElement(container, block, context)
    }
  }

  // =========================
  // 要素描画
  // =========================
  async renderElement(container, el, context) {

    if (!el) return

    // -------------------------
    // shorthand
    // -------------------------

    // "text"
    if (typeof el === "string") {
      el = { type: "text", text: el }
    }

    // spacer shorthand
    if (typeof el === "object" && el.spacer !== undefined) {
      el = {
        type: "spacer",
        size: el.spacer === true ? undefined : el.spacer
      }
    }

    // object shorthand
    if (typeof el === "object" && !el.type) {

      if (el.text !== undefined) {
        el.type = "text"
      }

      else if (el.image !== undefined) {
        el.type = "image"
        el.src = el.image
      }

      else if (el.h) {
        el.type = "hstack"
        el.children = el.h
      }

      else if (el.v) {
        el.type = "vstack"
        el.children = el.v
      }
    }

    // style shorthand
    if (el.s && !el.style) el.style = el.s

    if (!el.type) return

    // show
    if (el.show !== undefined && !this.evaluate(el.show, context)) return

    // hidden
    if (el.hidden !== undefined && this.evaluate(el.hidden, context)) return

    // children 内 repeat でも描画される
    if (el.type === "repeat") {
      let items = this.resolveData(el.items, context)
      if (!Array.isArray(items)) items = []

      if (items.length === 0 && el.empty) {
        await this.renderElement(container, el.empty, context)
        return
      }

      // repeatStack を作る（横/縦選択）
      const repeatStack = container.addStack()
      if (el.direction === "vertical") repeatStack.layoutVertically()
      else repeatStack.layoutHorizontally()

      repeatStack.spacing = el.spacing ?? 6

      // alignContent
      const align = el.align ?? "center"

      if (align === "top") repeatStack.topAlignContent()
      else if (align === "bottom") repeatStack.bottomAlignContent()
      else repeatStack.centerAlignContent()

      // template を repeatStack に再帰描画
      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        const newCtx = { ...context, item, index: i + 1 }
        if (el.template) {
          // ←ここで再帰呼び出し
          await this.renderBlock(repeatStack, [el.template], newCtx)
        }
      }
      return
    }

    // 通常描画
    switch (el.type) {
      case "text": return this.renderText(container, el, context)
      case "hstack": return this.renderStack(container, el, context, true)
      case "vstack": return this.renderStack(container, el, context, false)
      case "spacer": return this.renderSpacer(container, el)
      case "image": return await this.renderImage(container, el, context)
    }
  }

  // =========================
  // Text
  // =========================
  renderText(container, el, context) {

    const text = this.bind(el.text, context)
    const txt = container.addText(String(text ?? ""))

    this.applyStyle(txt, el.style, context)

    return txt
  }

  // =========================
  // Stack
  // =========================
  async renderStack(container, el, context, horizontal) {
    const stack = container.addStack()

    // background color
    if (el.backgroundColor) {
      const color = this.resolveColor(this.bind(el.backgroundColor, context), context)
      stack.backgroundColor = this.toColor(color)
    }

    // サイズ
    if (el.size) stack.size = new Size(el.size.width, el.size.height)

    // Padding
    if (el.padding) {
      const pad = el.padding
      stack.setPadding(pad.top ?? 0, pad.right ?? 0, pad.bottom ?? 0, pad.left ?? 0)
    }

    // Spacing
    if (el.spacing != null) stack.spacing = Number(el.spacing)

    // 配置方向
    if (horizontal) stack.layoutHorizontally()
    else stack.layoutVertically()

    // alignContent
    if (el.align === "top") stack.topAlignContent()
    else if (el.align === "bottom") stack.bottomAlignContent()
    else stack.centerAlignContent()

    const children = Array.isArray(el.children) ? el.children : []

    // justify
    if (!el.justify || el.justify === "start") {
      for (const child of children) await this.renderElement(stack, child, context)
    }
    else if (el.justify === "center") {
      stack.addSpacer()
      for (const child of children) await this.renderElement(stack, child, context)
      stack.addSpacer()
    }
    else if (el.justify === "end") {
      stack.addSpacer()
      for (const child of children) await this.renderElement(stack, child, context)
    }
    else if (el.justify === "space-between") {
      for (let i = 0; i < children.length; i++) {
        await this.renderElement(stack, children[i], context)
        if (i < children.length - 1) stack.addSpacer()
      }
    }

    return stack
  }

  // =========================
  // Spacer
  // =========================
  renderSpacer(container, el){

    if(el.size)
      container.addSpacer(el.size)
    else
      container.addSpacer()
  
  }

  // =========================
  // Image
  // =========================
  async renderImage(container, el, context){
    const rawSrc = this.resolveData(el.src, context)   // ★追加

    const size = el.size || 16
    const tint = this.bind(el.tint, context)
    const opacity = this.bind(el.opacity, context)

    let image

    // ★ DrawContext Image
    if (rawSrc && rawSrc.size) {

      image = rawSrc

    }

    // URL
    else if(typeof rawSrc === "string" && rawSrc.startsWith("http")){

      image = await this.fetchImage(rawSrc)

    }

    // SF Symbol
    else if(typeof rawSrc === "string" && !rawSrc.includes("/")){

      const sym = SFSymbol.named(rawSrc)
      sym.applyFont(Font.systemFont(size))

      image = sym.image

    }

    // local image
    else if(typeof rawSrc === "string"){

      const fm = FileManager.local()
      image = fm.readImage(rawSrc)

    }

    else{

      console.warn("Invalid image src: " + rawSrc)
      return

    }

    const node = container.addImage(image)

    if(tint != "")
      node.tintColor = new Color(tint)

    if(size)
      node.imageSize = new Size(size, size)
  
    if(opacity)
      node.imageOpacity = Number(opacity)

  }

  // =========================
  // Style
  // =========================
  applyStyle(textItem, styleInput, context) {

    const styles = context.config?.styles || {}

    const cacheKey = JSON.stringify(styleInput)

    let style = this.styleCache[cacheKey]

    if (!style) {
      style = {}

      if (typeof styleInput === "string") {
        style = { ...(styles[styleInput] || styles.defaultText || {}) }
      }
      else if (typeof styleInput === "object") {
        // base スタイル取得
        if (styleInput.base) {
          style = { ...(styles[styleInput.base] || {}) }
        }

        // 空文字は上書きしない
        for (const k in styleInput) {
          if (k === "base") continue
          const v = styleInput[k]
          if (v !== "" && v !== null && v !== undefined) {
            style[k] = v
          }
        }
      }
      else {
        style = styles.defaultText || {}
      }

      this.styleCache[cacheKey] = style
    }

    textItem.font = this.getFont(style)

    const colorValue = this.bind(style.color, context)

    if (colorValue === "") {

      const baseColor = styles[styleInput?.base]?.color

      if (baseColor) {
        const baseBind = this.bind(baseColor, context)
        const finalColor = this.toColor(baseBind)

        if (finalColor) {
          textItem.textColor = finalColor
        }
      }

    }
    else if (colorValue) {

      const resolvedColor = this.resolveColor(colorValue, context)
      const finalColor = this.toColor(resolvedColor)

      if (finalColor) {
        textItem.textColor = finalColor
      }

    }

    // lineLimit
    if (style.lineLimit !== undefined) {
      textItem.lineLimit = Number(style.lineLimit)
    }

    // minimumScaleFactor
    if (style.minimumScaleFactor !== undefined) {
      textItem.minimumScaleFactor = Number(style.minimumScaleFactor)
    }

    // shadowColor
    const shadowColor = this.bind(style.shadowColor, context)
    if (shadowColor) {
      textItem.shadowColor = new Color(shadowColor)
    }

    // shadowRadius
    if (style.shadowRadius !== undefined) {
      textItem.shadowRadius = Number(style.shadowRadius)
    }

    // shadowOffset
    if (style.shadowOffset) {
      const x = Number(style.shadowOffset.x || 0)
      const y = Number(style.shadowOffset.y || 0)
      textItem.shadowOffset = new Point(x, y)
    }

    // textOpacity
    const opacity = this.bind(style.opacity, context)
    if (opacity !== "" && !isNaN(opacity)) {
      textItem.textOpacity = Number(opacity)
    }
  }

  // =========================
  // bind（統一）
  // =========================
  bind(text, context) {

    if (text === undefined || text === null)
      return ""

    const str = String(text)

    // 完全変数
    const m = str.match(/^{{\s*([^}]+?)\s*}}$/)

    if (m) {
      const key = m[1]
      const val = this.resolve(key, context)
      return val ?? ""
    }

    // テンプレート
    return str.replace(/{{\s*([^}]+?)\s*}}/g, (_, key) => {
      const val = this.resolve(key.trim(), context)
      return val ?? ""

    })
  }

  // =========================
  // evaluate（完全安定版）
  // =========================
  evaluate(expr, context) {

    if (expr === undefined || expr === null) return true
    if (typeof expr === "boolean") return expr

    let raw = String(expr).trim()

    if (raw.startsWith("{{") && raw.endsWith("}}")) {
      raw = raw.slice(2, -2).trim()
    }

    // cache
    if (!this.evalCache) this.evalCache = {}

    let func = this.evalCache[raw]

    if (!func) {

      try {

        func = new Function("ctx", `
          with(ctx){
            return (${raw})
          }
        `)

        this.evalCache[raw] = func

      } catch (e) {

        console.warn("evaluate compile error: " + raw)
        return false

      }

    }

    try {
      const func = new Function("ctx", `
        with(ctx){
          return (${raw})
        }
      `)

      return !!func(this.buildEvalContext(context))

    } catch (e) {
      console.warn("evaluate error: " + raw)
      return false
    }
  }

  // =========================
  // context buildEval
  // =========================
  buildEvalContext(context) {
    return {
      ...(context.config?.values || {}),
      ...(context.data || {}),
      ...(context.location || {}),
      ...(context.item || {}),
      index: context.index,
      version: context.version,
      update: context.update
    }
  }

  // =========================
  // resolve
  // =========================
  resolve(key, context) {

    if (!key) return undefined

    if (key.includes(".")) {
      return this.getByPath(context, key)
    }

    const priority = context.item
      ? ["item", "location", "config.values", "data"]
      : ["location", "config.values", "data", "update"]

    for (const p of priority) {

      const base = p.includes(".")
        ? this.getByPath(context, p)
        : context[p]

      if (base && key in base) {
        return base[key]
      }
    }

    if (key === "version") return context.version

    return undefined
  }

  getByPath(obj, path) {
    return path.split(".").reduce((o, k) => (o ? o[k] : undefined), obj)
  }

  // =========================
  // resolveData
  // =========================
  resolveData(expr, context) {

    if (!expr) return null
    if (typeof expr !== "string") return expr
    if (!expr.startsWith("{{")) return expr

    const key = expr.replace(/{{|}}/g, "").trim()

    return this.resolve(key, context)
  }

  // =========================
  // getFont
  // =========================
  getFont(style) {

    if (style.font instanceof Font) {
      return style.font
    }

    const size = Number(style.fontSize) || 14
    const type = style.font || "system"
    const bold = style.bold || false

    const key = `${type}_${size}_${bold}`

    if (this.fontCache[key]) {
      return this.fontCache[key]
    }

    let font

    if (type === "semibold") {
      font = Font.semiboldSystemFont(size)
    }
    else if (type === "monospace") {
      font = Font.boldMonospacedSystemFont(size)
    }
    else {

      font = bold
        ? Font.boldSystemFont(size)
        : Font.systemFont(size)

    }

    this.fontCache[key] = font

    return font

  }

  // =========================
  // getDefaultTextColor
  // =========================
  getDefaultTextColor() {
    return Device.isUsingDarkAppearance()
      ? Color.white()
      : Color.black()
  }

  // =========================
  // resolveColor
  // =========================
  resolveColor(color, context) {
    if (!color) return null
    if (typeof color === "string" && color.includes("{{")) {
      return this.bind(color, context)
    }
    return color
  }

  // =========================
  // ■ toColor
  // =========================
  toColor(value) {
    if (value === "" || value === null || value === undefined)
      return null
    if (value instanceof Color)
      return value
    try {
      return new Color(String(value))
    } catch (e) {
      return null
    }
  }

  // =========================
  // ■ setGradientBackground
  // =========================
  async setGradientBackground(colorTop, colorBottom) {

    const bgColor = new LinearGradient();
    bgColor.colors = [new Color(colorTop), new Color(colorBottom)]
    bgColor.locations = [0, 1]           // 上端0 → 下端1
    return bgColor 
  }

  // =========================
  // ■ fetchImage
  // =========================
  async fetchImage(url){

    const fileName = this.hash(url) + ".png"
    const filePath = this.fm.joinPath(this.cacheDir, fileName)

    if(this.fm.fileExists(filePath)){
      return this.fm.readImage(filePath)
    }

    const req = new Request(url)
    const img = await req.loadImage()

    this.fm.writeImage(filePath, img)

    return img

  }

  // =========================
  // ■ fetch
  // =========================
  hash(str){
    return str.replace(/[^\w]/g,"_")
  }
}