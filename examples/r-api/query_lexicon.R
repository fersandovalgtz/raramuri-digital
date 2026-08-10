#!/usr/bin/env Rscript

args <- commandArgs(trailingOnly = TRUE)
query <- if (length(args) >= 1) args[[1]] else "agua"
limit <- if (length(args) >= 2) as.integer(args[[2]]) else 5L

if (is.na(limit) || limit < 1L || limit > 200L) {
  stop("El límite debe ser un entero entre 1 y 200.")
}

if (!requireNamespace("jsonlite", quietly = TRUE)) {
  stop("Falta la dependencia 'jsonlite'. Instálela con install.packages('jsonlite').")
}

base_url <- "https://raramuri.ceees.mx/api/lexicon"
url <- paste0(
  base_url,
  "?q=", utils::URLencode(query, reserved = TRUE),
  "&limit=", limit
)

payload <- tryCatch(
  jsonlite::fromJSON(url),
  error = function(e) stop("No fue posible consultar la API: ", conditionMessage(e))
)

entries <- payload$entries
if (is.null(entries) || NROW(entries) == 0L) {
  cat("No se encontraron resultados.\n")
  quit(status = 0)
}

fields <- intersect(c("recordId", "headword", "translationRaw"), names(entries))
print(entries[, fields, drop = FALSE], row.names = FALSE)

cat(
  "\nEstado: ", payload$publicationStatus,
  "; ", payload$validationStatus,
  "\n",
  sep = ""
)
