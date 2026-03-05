module.exports = {

  async present(activeCfg, profileEngine, activeProfile) {
    const table = new UITable()
          table.dismissOnSelect = false
          table.showSeparators = true
    await this.createTable(table, {...activeCfg}, profileEngine, activeProfile)
    await table.present(activeCfg.values.showTableFullscreen ?? false)
  },

  async createTable(table, activeCfg, profileEngine, activeProfile) {
    table.removeAllRows()
    await this.createItemsCell(table, {...activeCfg}, profileEngine, activeProfile)
  },

  async createItemsCell(table, activeCfg, profileEngine, activeProfile) {

    const UI_ICON = {
      open: "▼",
      close: "▶",
      on: "■",
      off: "□",
      selected: "●",
      unselected: "○",
      reload: "↺"
    }

    function createSectionHeader(row, sectionName, isOpen) {
      const icon = isOpen ? UI_ICON.open : UI_ICON.close

      const txt = row.addText(`${icon} ${sectionName}`)
      txt.titleFont = Font.mediumSystemFont(12)
      row.isHeader = true
    }

    function createItemRow(row, item, value) {
      const icon = item.readonly ? UI_ICON.off : UI_ICON.on
      const label = item.label || item.key
    
      const left = row.addText(`    ${icon} ${label}`)
      left.titleFont = Font.systemFont(16)
      left.widthWeight = 70
    
      const display = formatValue(value, item.type)
    
      const right = row.addText(display)
      right.titleFont = Font.systemFont(14)
      right.widthWeight = 30
      right.rightAligned()
    
      // BOOL
      if (item.type === "bool") {
        right.titleColor = value ? Color.green() : Color.red()
      }
    
      // COLOR
      if (item.type === "color") {
        try {
          const color = new Color(value)
      
          row.backgroundColor = color
      
          const brightness =
            color.red * 0.299 +
            color.green * 0.587 +
            color.blue * 0.114
      
          const textColor =
            brightness > 0.55
              ? Color.black()
              : Color.white()
      
          left.titleColor = textColor
          right.titleColor = textColor
      
        } catch {}
      }
    
      // Select
      if (item.type === "select") {
        right.titleColor = Color.blue()
      }
      // readonly
      if (item.readonly) {
        left.titleColor = Color.gray()
        right.titleColor = Color.gray()
      }
    }

    function formatValue(val, type) {
      if (type === "bool") return val ? "ON" : "OFF"
      if (type === "color") return val || "#ffffff"
      return String(val)
    }

    // Table
    const schemaObj = activeCfg.schema
    const values = activeCfg.values
    const version = profileEngine.version
    const defaultOpenSections = activeCfg.defaultOpenSections

    const sections = {}
    let selected = null

    // sections構築（最初）
    for (const key in schemaObj) {
      const item = schemaObj[key]
      const sec = item.section || "General"

      if (!sections[sec]) sections[sec] = []

      sections[sec].push({
        key,
        ...item
      })
    }

    // sectionState初期化
    let sectionState = {}

    for (const sec in sections) {
      const key = `section_${sec}`
      sectionState[sec] = values[key] === true
    }

    // Profile
    const profileRow = new UITableRow()
    const left = profileRow.addText(`${UI_ICON.open} Profile v.${version}`)
    left.titleFont = Font.systemFont(16)
    
    const right = profileRow.addText(`${activeProfile} ›`)
    right.titleFont = Font.semiboldSystemFont(14)
    right.titleColor = Color.blue()
    right.rightAligned()
    
    profileRow.dismissOnSelect = false
    profileRow.onSelect = async() => {

      const list = profileEngine.list()

      const a = new Alert()
      a.title = "Select Profile"

      list.forEach(p => a.addAction(p === activeProfile ? `${UI_ICON.selected} ${p}` : String(p)))
      a.addCancelAction("Cancel")

      const r = await a.present()

      if (r !== -1) {
        const selectedProfile = list[r]

        profileEngine.setActive(selectedProfile)
        activeProfile = selectedProfile

        const cfg = profileEngine.getConfig()
//         values = JSON.parse(JSON.stringify(cfg.values))

        await this.createTable(table, {...cfg}, profileEngine, activeProfile)
      }
    }
    table.addRow(profileRow)

    // Sections Close All / Sections Open All
    const controlRow = new UITableRow()

    const allOpen = Object.values(sectionState).every(v => v === true)
    const toggleBtn = controlRow.addButton(allOpen ? `${UI_ICON.close} Close All` : `${UI_ICON.open} Open All`)
    toggleBtn.centerAligned()
    toggleBtn.onTap = async () => {

      const allOpen = Object.values(sectionState).every(v => v === true)

      for (const sec in sections) {
        const newState = !allOpen
        sectionState[sec] = newState
        values[`section_${sec}`] = newState
      }

      activeCfg.values = values
      await this.createTable(table, {...activeCfg}, profileEngine, activeProfile)
    }

    // Sections Default Open
    const restoreBtn = controlRow.addButton(`${UI_ICON.reload} Default`)
    restoreBtn.centerAligned()
    restoreBtn.onTap = async () => {

      for (const sec in sections) {
        const isOpen = defaultOpenSections.includes(sec)
        sectionState[sec] = isOpen
        values[`section_${sec}`] = isOpen
      }

      activeCfg.values = values
      await this.createTable(table, {...activeCfg}, profileEngine, activeProfile)
    }

    table.addRow(controlRow)

    // Sections
    for (const sectionName in sections) {

      const isOpen = sectionState[sectionName]
      const iconArrow = isOpen ? UI_ICON.close : UI_ICON.open

      // Section Header
      const header = new UITableRow()
      createSectionHeader(header, sectionName, isOpen)
      header.dismissOnSelect = false
      header.onSelect = async() => {
        const newState = !sectionState[sectionName]
        sectionState[sectionName] = !sectionState[sectionName]
        values[`section_${sectionName}`] = newState

        activeCfg.values = values
        await this.createTable(table, {...activeCfg}, profileEngine, activeProfile)
      }
      table.addRow(header)

      // Section Items
      if (!sectionState[sectionName]) continue

      for (const item of sections[sectionName]) {

        if (item.hidden) continue

        const iconState = item.readonly ? UI_ICON.on : UI_ICON.off
        const row = new UITableRow()

        const current =
          values[item.key] ??
          item.default ??
          ""

        createItemRow(row, item, current)

        if (item.readonly) {
          row.onSelect = null
        } else {
          row.dismissOnSelect = false
          row.onSelect = async() => {
            selected = item

            const current =
              values[item.key] ??
              item.default ??
              ""

            // BOOL
            if (item.type === "bool" || item.type === "boolean") {
              values[item.key] = !Boolean(current)

              activeCfg.values = values
              await this.createTable(table, {...activeCfg}, profileEngine, activeProfile)
              return
            }

            // SELECT
            else if (item.type === "select") {

              const opts = item.options || []

              const a = new Alert()
              a.title = item.label || item.key
              opts.forEach(o => {
                const mark = (o === current) ? `${UI_ICON.selected} ` : ""
                a.addAction(mark + String(o))
              })
              a.addCancelAction("Cancel")
              const r = await a.present()

              if (r !== -1) {
                values[item.key] = opts[r]
              }

              activeCfg.values = values
              await this.createTable(table, {...activeCfg}, profileEngine, activeProfile)
              return
            }

            // COLOR
            else if (item.type === "color") {

              const presets = item.presets || [
                "#ffffff",
                "#000000",
                "#ff3b30",
                "#34c759",
                "#007aff",
                "#ffcc00"
              ]

              const a = new Alert()
              a.title = item.label || item.key
              presets.forEach(c => a.addAction(c))
              a.addAction("Custom HEX")
              a.addCancelAction("Cancel")
              const r = await a.present()

              if (r === -1) {

                activeCfg.values = values
                await this.createTable(table, {...activeCfg}, profileEngine, activeProfile)
                return
              } else if (r < presets.length) {
                values[item.key] = presets[r]

                activeCfg.values = values
                await this.createTable(table, {...activeCfg}, profileEngine, activeProfile)
                return
              } else {
                const input = await this.prompt("HEX Color", current)

                if (input !== null) {
                  try {
                    new Color(input)
                    values[item.key] = input
                  } catch {
                    const err = new Alert()
                    err.title = "Invalid HEX"
                    err.addAction("OK")
                    await err.present()
                  }
                }

                activeCfg.values = values
                await this.createTable(table, {...activeCfg}, profileEngine, activeProfile)
                return
              }
            }

            // DEFAULT
            const input = await this.prompt(item.label, current)

            if (input !== null) {
              values[item.key] = this.castSafe(
                input,
                item.type,
                current
              )

              activeCfg.values = values
              await this.createTable(table, {...activeCfg}, profileEngine, activeProfile)
            }
          }
        }

        table.addRow(row)
      }
    }

    // スペース
    const spaceRow = new UITableRow()
    table.addRow(spaceRow)

    // キャンセル
    let resValues = null
    const actionRow = new UITableRow()
    const cancelBtn = actionRow.addButton("Cancel")
    cancelBtn.centerAligned()
    cancelBtn.dismissOnTap = true

    // 保存
    const saveBtn = actionRow.addButton("Save & Close")
    saveBtn.centerAligned()
    saveBtn.dismissOnTap = true
    saveBtn.onTap = async() => {
      const cfg = profileEngine.getConfig()
      cfg.values = values
      profileEngine.saveConfig(activeProfile, cfg)
    }
    table.addRow(actionRow)
    table.reload()
  },

  async prompt(title, def) {

    const a = new Alert()
    a.title = title

    a.addTextField("", String(def ?? ""))

    a.addAction("OK")
    a.addCancelAction("Cancel")

    const r = await a.present()

    if (r === -1) return null

    return a.textFieldValue(0)
  },

  isEqual(a, b) {
    return JSON.stringify(a) === JSON.stringify(b)
  },

  castSafe(val, type, fallback) {

    if (type === "number") {
      const n = Number(val)
      return isNaN(n) ? Number(fallback || 0) : n
    }

    if (type === "bool" || type === "boolean") {
      if (typeof val === "boolean") return val
      return val === "true"
    }

    return val
  }
}