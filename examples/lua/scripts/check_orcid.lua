-- Verifica se todos os autores têm ORCID válido
function validate_orcid(authors)
    for _, author in ipairs(authors) do
        if not author.orcid or #author.orcid ~= 19 then  -- formato padrão ORCID
            return false, "Autor sem ORCID válido: " .. (author.name or "desconhecido")
        end
    end
    return true, "Todos autores com ORCID OK"
end

print("Script check_orcid.lua carregado com sucesso!")
