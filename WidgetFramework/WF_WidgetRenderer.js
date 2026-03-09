// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: magic;
/**
 * WF_WidgetRenderer
 **/
module.exports = class WF_WidgetRenderer {

  constructor(appId) {
    this.appId = appId
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
      widget.addSpacer()
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
        if (block.align === "top") repeatStack.topAlignContent()
        else if (block.align === "center") repeatStack.centerAlignContent()
        else if (block.align === "bottom") repeatStack.bottomAlignContent()

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
    if (!el || typeof el !== "object" || !el.type) return
    if (el.show !== undefined && !this.evaluate(el.show, context)) return

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

      if (el.align === "top") repeatStack.topAlignContent()
      else if (el.align === "center") repeatStack.centerAlignContent()
      else if (el.align === "bottom") repeatStack.bottomAlignContent()

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
    else if (el.align === "center") stack.centerAlignContent()
    else if (el.align === "bottom") stack.bottomAlignContent()

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

    const src = this.bind(el.src, context)
    if(!src) return

    const size = el.size || 16

    const tint = this.bind(el.tint, context)
    const opacity = this.bind(el.opacity, context)

    let image

    // URL
    if(src.startsWith("http")){

      image = await this.fetchImage(src)

    }

    // SF Symbol
    else if(!src.includes("/")){

      const sym = SFSymbol.named(src)
      sym.applyFont(Font.systemFont(size))

      image = sym.image

    }

    // local image
    else{

      const fm = FileManager.local()
      image = fm.readImage(src)

    }

    const node = container.addImage(image)

    if(el.tint)
      node.tintColor = new Color(tint)

    if(size)
      node.imageSize = new Size(size, size)
  
    if(el.opacity)
      node.imageOpacity = Number(opacity)

  }

  // =========================
  // Style
  // =========================
  applyStyle(textItem, styleInput, context) {

    const styles = context.config?.styles || {}

    let style = {}

    if (typeof styleInput === "string") {
      style = styles[styleInput] || styles.defaultText || {}
    }
    else if (typeof styleInput === "object") {
      // base スタイル取得
      if (styleInput.base) {
        style = { ...(styles[styleInput.base] || {}) }
      }

      // base の上に上書き
      style = { ...style, ...styleInput }
    }
    else {
      style = styles.defaultText || {}
    }

    const size = Number(style.fontSize) || 14

    textItem.font = style.bold
      ? Font.boldSystemFont(size)
      : Font.systemFont(size)

    const rawColor = style.color
      ? this.resolveColor(this.bind(style.color, context), context)
      : null

    const finalColor = this.toColor(rawColor)

    if (finalColor) {
      textItem.textColor = finalColor
    }
  }

  // =========================
  // bind（統一）
  // =========================
  bind(text, context) {

    if (!text) return ""

    return String(text).replace(/{{(.*?)}}/g, (_, rawKey) => {
      const key = rawKey.trim()
      const val = this.resolve(key, context)
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
    if (!value) return this.getDefaultTextColor()
    if (value instanceof Color) return value

    try {
      return new Color(String(value))
    } catch (e) {
      return this.getDefaultTextColor()
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

    const fm = FileManager.iCloud()

    // ルート（WF_Data固定）
    const root = fm.joinPath(
      fm.documentsDirectory(),
      "WF_Data"
    )

    const appRoot = fm.joinPath(root, this.appId)
    const cacheDir = fm.joinPath(appRoot, "img")

    if(!fm.fileExists(appRoot))
      fm.createDirectory(appRoot)

    if(!fm.fileExists(cacheDir))
      fm.createDirectory(cacheDir)

    const fileName = this.hash(url) + ".png"
    const filePath = fm.joinPath(cacheDir, fileName)

    // キャッシュがあればそれを使う
    if(fm.fileExists(filePath)){
      return fm.readImage(filePath)
    }

    // 無ければダウンロード
    const req = new Request(url)
    const img = await req.loadImage()

    fm.writeImage(filePath, img)

    return img

  }

  // =========================
  // ■ fetch
  // =========================
  hash(str){
    return str.replace(/[^\w]/g,"_")
  }
}