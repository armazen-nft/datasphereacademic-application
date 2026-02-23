-- check_orcid.lua
-- Valida ORCID por formato + dígito verificador (ISO 7064 Mod 11-2)

local function normalize_orcid(orcid)
  if type(orcid) ~= "string" then
    return nil
  end

  local cleaned = orcid:gsub("https?://orcid%.org/", "")
  cleaned = cleaned:gsub("%s+", "")

  if cleaned:match("^%d%d%d%d%-%d%d%d%d%-%d%d%d%d%-%d%d%d[%dX]$") then
    return cleaned
  end

  return nil
end

local function calculate_check_digit(first_15_digits)
  local total = 0

  for i = 1, #first_15_digits do
    local digit = tonumber(first_15_digits:sub(i, i))
    total = (total + digit) * 2
  end

  local remainder = total % 11
  local result = (12 - remainder) % 11

  if result == 10 then
    return "X"
  end

  return tostring(result)
end

local function validate_orcid(orcid)
  local normalized = normalize_orcid(orcid)

  if not normalized then
    return false, "Formato ORCID inválido"
  end

  local compact = normalized:gsub("-", "")
  local base = compact:sub(1, 15)
  local provided = compact:sub(16, 16)
  local expected = calculate_check_digit(base)

  if provided ~= expected then
    return false, "Dígito verificador ORCID inválido"
  end

  return true, "ORCID válido"
end

return {
  run = function(input)
    local value = input and input.orcid or nil
    local ok, message = validate_orcid(value)

    return {
      ok = ok,
      message = message,
      orcid = normalize_orcid(value)
    }
  end
}
