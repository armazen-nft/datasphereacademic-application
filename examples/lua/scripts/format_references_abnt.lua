-- format_references_abnt.lua
-- Formata referências (livro/artigo) em estilo ABNT simplificado

local function trim(text)
  if type(text) ~= "string" then
    return ""
  end

  return (text:gsub("%s+", " "):gsub("^%s+", ""):gsub("%s+$", ""))
end

local function upper_author(author)
  local value = trim(author)

  if value == "" then
    return "AUTOR DESCONHECIDO"
  end

  return string.upper(value)
end

local function format_book(ref)
  local author = upper_author(ref.author)
  local title = trim(ref.title)
  local city = trim(ref.city)
  local publisher = trim(ref.publisher)
  local year = trim(tostring(ref.year or "s.d."))

  if title == "" then
    title = "Título não informado"
  end

  if city == "" then
    city = "[S.l.]"
  end

  if publisher == "" then
    publisher = "[s.n.]"
  end

  return string.format("%s. %s. %s: %s, %s.", author, title, city, publisher, year)
end

local function format_article(ref)
  local author = upper_author(ref.author)
  local title = trim(ref.title)
  local journal = trim(ref.journal)
  local volume = trim(tostring(ref.volume or ""))
  local number = trim(tostring(ref.number or ""))
  local pages = trim(ref.pages)
  local year = trim(tostring(ref.year or "s.d."))

  if title == "" then
    title = "Título não informado"
  end

  if journal == "" then
    journal = "Periódico não informado"
  end

  local vol_num = ""
  if volume ~= "" then
    vol_num = vol_num .. "v. " .. volume
  end
  if number ~= "" then
    if vol_num ~= "" then
      vol_num = vol_num .. ", "
    end
    vol_num = vol_num .. "n. " .. number
  end

  local pages_part = ""
  if pages ~= "" then
    pages_part = ", p. " .. pages
  end

  if vol_num ~= "" then
    vol_num = ", " .. vol_num
  end

  return string.format("%s. %s. %s%s%s, %s.", author, title, journal, vol_num, pages_part, year)
end

local function format_reference(ref)
  local kind = trim(ref.type)

  if kind == "article" then
    return format_article(ref)
  end

  return format_book(ref)
end

return {
  run = function(input)
    local refs = input and input.references or {}
    local formatted = {}

    for i = 1, #refs do
      formatted[#formatted + 1] = format_reference(refs[i])
    end

    return {
      ok = true,
      count = #formatted,
      references = formatted
    }
  end
}
