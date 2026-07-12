#!/usr/bin/env python3
"""Copy the bundled Omega production kit template into a target directory."""

from __future__ import annotations

import argparse
import shutil
from pathlib import Path

TEXT_SUFFIXES = {
    ".cfg",
    ".conf",
    ".dockerfile",
    ".env",
    ".json",
    ".md",
    ".py",
    ".tf",
    ".sh",
    ".toml",
    ".ts",
    ".tsx",
    ".txt",
    ".yaml",
    ".yml",
}
TOKEN_MAP = {
    "project_name": "OMEGA_PROJECT_NAME",
    "namespace": "OMEGA_NAMESPACE",
    "aws_region": "OMEGA_AWS_REGION",
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("target", type=Path, help="Directory to create or populate")
    parser.add_argument("--project-name", default="omega", help="Project/name prefix for generated files")
    parser.add_argument("--namespace", default="omega-ai", help="Kubernetes namespace")
    parser.add_argument("--aws-region", default="us-east-1", help="Default AWS region for Terraform")
    parser.add_argument("--force", action="store_true", help="Overwrite an existing non-empty target directory")
    return parser.parse_args()


def is_text_file(path: Path) -> bool:
    return path.suffix.lower() in TEXT_SUFFIXES or path.name in {"Dockerfile"}


def render_file(path: Path, replacements: dict[str, str]) -> None:
    if not is_text_file(path):
        return
    text = path.read_text(encoding="utf-8")
    for key, token in TOKEN_MAP.items():
        text = text.replace(token, replacements[key])
    path.write_text(text, encoding="utf-8")


def main() -> None:
    args = parse_args()
    skill_dir = Path(__file__).resolve().parents[1]
    template_dir = skill_dir / "assets" / "omega-template"
    target = args.target.resolve()

    if not template_dir.is_dir():
        raise SystemExit(f"Template directory not found: {template_dir}")

    if target.exists() and any(target.iterdir()):
        if not args.force:
            raise SystemExit(f"Target exists and is not empty: {target}. Use --force to overwrite.")
        shutil.rmtree(target)

    shutil.copytree(template_dir, target, dirs_exist_ok=True)
    replacements = {
        "project_name": args.project_name,
        "namespace": args.namespace,
        "aws_region": args.aws_region,
    }
    for path in target.rglob("*"):
        if path.is_file():
            render_file(path, replacements)

    print(f"Omega production kit scaffolded at {target}")
    print("Next steps:")
    print("  1. Review generated docs/physical-build-plan.md and docs/production-topology.md")
    print("  2. Install and validate the runnable kernel with: npm install && npm run typecheck && npm run core:once && npm run system:once && npm run kernel:once && npm run v4:once")
    print("  3. Start the local stack with: docker compose up --build")
    print("  4. Replace dev secrets before any shared or production deployment")


if __name__ == "__main__":
    main()
