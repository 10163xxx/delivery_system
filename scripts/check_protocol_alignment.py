from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
BACKEND = ROOT / "backend" / "src" / "main" / "scala"
FRONTEND = ROOT / "frontend" / "src"

PROTOCOL_MODULES = (
    "admin",
    "auth",
    "customer",
    "merchant",
    "order",
    "review",
    "rider",
)

FRONTEND_API_IGNORE = {
    "AdminApi",
    "AuthApi",
    "CustomerApi",
    "MerchantApi",
    "OrderApi",
    "ReviewApi",
    "RiderApi",
}

PASCAL_CASE_FILE = re.compile(r"^[A-Z][A-Za-z0-9]*$")


def collect_relative_files(base: Path, pattern: str, suffix: str) -> set[str]:
    return {
        str(path.relative_to(base)).removesuffix(suffix)
        for path in base.glob(pattern)
        if path.is_file()
    }


def normalize_frontend_api(path: str) -> str:
    return path.removeprefix("apis/")


def normalize_backend_api(path: str) -> str:
    return path.replace("/api/", "/", 1)


def normalize_frontend_object(path: str) -> str:
    return path.removeprefix("objects/")


def normalize_backend_object(path: str) -> str:
    return path.replace("/object/", "/", 1)


def collect_backend_apis() -> set[str]:
    values: set[str] = set()
    for module in PROTOCOL_MODULES:
        values.update(
            normalize_backend_api(value)
            for value in collect_relative_files(BACKEND, f"{module}/api/**/*.scala", ".scala")
        )
    return values


def collect_frontend_apis() -> set[str]:
    values: set[str] = set()
    for module in PROTOCOL_MODULES:
        values.update(
            normalize_frontend_api(value)
            for value in collect_relative_files(FRONTEND, f"apis/{module}/**/*.ts", ".ts")
            if Path(value).stem not in FRONTEND_API_IGNORE
        )
    return values


def collect_backend_objects() -> set[str]:
    values: set[str] = set()
    for module in PROTOCOL_MODULES:
        values.update(
            normalize_backend_object(value)
            for value in collect_relative_files(BACKEND, f"{module}/object/**/*.scala", ".scala")
        )
    return values


def collect_frontend_objects() -> set[str]:
    values: set[str] = set()
    for module in PROTOCOL_MODULES:
        values.update(
            normalize_frontend_object(value)
            for value in collect_relative_files(FRONTEND, f"objects/{module}/**/*.ts", ".ts")
        )
    return values


def collect_bad_names() -> list[Path]:
    roots = (FRONTEND, BACKEND)
    bad_paths: list[Path] = []
    for root in roots:
        for path in root.rglob("*"):
            if not path.is_file():
                continue
            if "-" in path.name:
                bad_paths.append(path.relative_to(ROOT))
                continue
            if path.suffix in {".ts", ".tsx", ".scala"} and path.parent.name in {"api", "apis", "object", "objects"}:
                if not PASCAL_CASE_FILE.match(path.stem):
                    bad_paths.append(path.relative_to(ROOT))
    return sorted(bad_paths)


def print_diff(title: str, values: set[str] | list[Path]) -> None:
    if not values:
        return
    print(title)
    for value in sorted(values):
        print(f"  - {value}")


def main() -> int:
    backend_objects = collect_backend_objects()
    frontend_objects = collect_frontend_objects()
    backend_apis = collect_backend_apis()
    frontend_apis = collect_frontend_apis()
    bad_names = collect_bad_names()

    backend_only_objects = backend_objects - frontend_objects
    frontend_only_objects = frontend_objects - backend_objects
    backend_only_apis = backend_apis - frontend_apis
    frontend_only_apis = frontend_apis - backend_apis

    has_error = any(
        (
            backend_only_objects,
            frontend_only_objects,
            backend_only_apis,
            frontend_only_apis,
            bad_names,
        )
    )

    if not has_error:
        print("Protocol alignment check passed.")
        return 0

    print_diff("Backend protocol objects missing on frontend:", backend_only_objects)
    print_diff("Frontend protocol objects missing on backend:", frontend_only_objects)
    print_diff("Backend protocol APIs missing on frontend:", backend_only_apis)
    print_diff("Frontend protocol APIs missing on backend:", frontend_only_apis)
    print_diff("Files using disallowed naming:", bad_names)
    return 1


if __name__ == "__main__":
    sys.exit(main())
