#!/usr/bin/env python3
"""Fail if tracked Markdown files are not UTF-8 (without BOM)."""

from __future__ import annotations

import subprocess
from pathlib import Path


def tracked_markdown_files() -> list[Path]:
    output = subprocess.check_output(["git", "ls-files", "*.md"], text=True)
    return [Path(line) for line in output.splitlines() if line.strip()]


def main() -> int:
    failed: list[str] = []

    for file_path in tracked_markdown_files():
        data = file_path.read_bytes()

        if data.startswith(b"\xef\xbb\xbf"):
            failed.append(f"{file_path}: UTF-8 BOM encontrado")
            continue

        try:
            data.decode("utf-8")
        except UnicodeDecodeError as exc:
            failed.append(
                f"{file_path}: não está em UTF-8 válido "
                f"(linha {exc.start}, byte {exc.object[exc.start:exc.start+1]!r})"
            )

    if failed:
        print("❌ Falha na validação de encoding dos arquivos Markdown:")
        for item in failed:
            print(f"- {item}")
        print("\nConverta os arquivos para UTF-8 sem BOM.")
        return 1

    print("✅ Todos os arquivos Markdown rastreados estão em UTF-8 sem BOM.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
