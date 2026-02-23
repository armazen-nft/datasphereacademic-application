function validate(authors)
    for _, author in ipairs(authors) do
        if not author.orcid or #author.orcid < 16 then
            return false, "Autor sem ORCID válido"
        end
    end
    return true, "Todos autores com ORCID"
end
