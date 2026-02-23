-- Formata referências no estilo ABNT (exemplo básico)
function format_abnt(references)
    local formatted = {}
    for i, ref in ipairs(references) do
        table.insert(formatted, i .. ". " .. ref.author .. ". " .. ref.title .. ". " .. ref.year .. ".")
    end
    return table.concat(formatted, "\n")
end

print("Script format_references_abnt.lua carregado com sucesso!")
