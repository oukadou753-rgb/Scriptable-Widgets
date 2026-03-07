// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: magic;
/**
 * WF_WidgetRenderer
 **/
module.exports = class WF_WidgetRenderer {

  constructor() {}

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
    if (values.bgColor) {
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

      if (block.show !== undefined) {
        const visible = this.evaluate(block.show, context)
        if (!visible) continue
      }

      // =========================
      // repeat（完全版）
      // =========================
      if (block.type === "repeat") {

        let items = this.resolveData(block.items, context)

        if (!Array.isArray(items)) items = []

        // filter
        if (block.filter) {
          items = items.filter(item => {
            const tmpCtx = { ...context, item }
            return this.evaluate(block.filter, tmpCtx)
          })
        }

        // sort
        if (block.sortBy) {

          const key = block.sortBy

          const orderRaw = block.order
            ? this.bind(block.order, context)
            : "desc"

          const order = orderRaw === "asc" ? 1 : -1

          items = [...items].sort((a, b) => {
            const av = a?.[key]
            const bv = b?.[key]

            if (av === bv) return 0
            if (av === undefined) return 1
            if (bv === undefined) return -1

            if (typeof av === "string") {
              return av.localeCompare(bv) * order
            }

            return (Number(av) - Number(bv)) * order
          })
        }

        // limit
        if (block.limit) {
          const limit = Number(this.bind(block.limit, context)) || 0
          items = items.slice(0, limit)
        }

        // empty対応
        if (items.length === 0) {
          if (block.empty) {
            await this.renderElement(container, block.empty, context)
          }
          continue
        }

        // 描画
        for (let i = 0; i < items.length; i++) {

          const item = items[i]

          const newCtx = {
            ...context,
            item: item || {},
            index: i + 1
          }

          if (block.template) {
            await this.renderBlock(container, [block.template], newCtx)
          }
        }

        continue
      }

      // 通常描画
      await this.renderElement(container, block, context)
    }
  }

  // =========================
  // 要素描画
  // =========================
  async renderElement(container, el, context) {

    if (!el || typeof el !== "object") return
    if (!el.type) return

    // show（完全版）
    if (el.show !== undefined) {
      const visible = this.evaluate(el.show, context)
      if (!visible) return
    }

    switch (el.type) {

      case "text":
        return this.renderText(container, el, context)

      case "hstack":
        return this.renderStack(container, el, context, true)

      case "vstack":
        return this.renderStack(container, el, context, false)

      case "spacer":
      return this.renderSpacer(container, el)
  
      case "image":
        return await this.renderImage(container, el, context)
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

    if (horizontal) stack.layoutHorizontally()
    else stack.layoutVertically()

    const children = Array.isArray(el.children) ? el.children : []

    if (el.align === "top") stack.topAlignContent()
    else if (el.align === "center") stack.centerAlignContent()
    else if (el.align === "bottom") stack.bottomAlignContent()

    if (!el.justify || el.justify === "start") {

      for (const child of children) {
        await this.renderElement(stack, child, context)
      }
    }

    else if (el.justify === "center") {

      stack.addSpacer()

      for (const child of children) {
        await this.renderElement(stack, child, context)
      }

      stack.addSpacer()
    }

    else if (el.justify === "end") {

      stack.addSpacer()

      for (const child of children) {
        await this.renderElement(stack, child, context)
      }
    }

    else if (el.justify === "space-between") {

      for (let i = 0; i < children.length; i++) {

        await this.renderElement(stack, children[i], context)

        if (i < children.length - 1) {
          stack.addSpacer()
        }
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

      image = await this.dataProvider.fetchImage(src)

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
  applyStyle(textItem, styleName, context) {

    const styles = context.config?.styles || {}

    const style =
      styles[styleName] ||
      styles.defaultText ||
      {}

    const size = Number(style.fontSize) || 14

    textItem.font = style.bold
      ? Font.boldSystemFont(size)
      : Font.systemFont(size)

    const rawColor = style.color
      ? this.resolveColor(style.color, context)
      : null

    const finalColor = this.toColor(rawColor)

    textItem.textColor = finalColor
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

  toColor(value) {
    if (!value) return this.getDefaultTextColor()
    if (value instanceof Color) return value

    try {
      return new Color(String(value))
    } catch (e) {
      return this.getDefaultTextColor()
    }
  }
}
