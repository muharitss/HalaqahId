---
trigger: always_on
---

## Installation Policy

The agent must NEVER install, uninstall, update, or manage any dependency, package, library, tool, runtime, SDK, or system software.

If the implementation requires something that is not currently available:

1. Do NOT install it.
2. Do NOT execute an installation command.
3. Do NOT use the terminal to check whether it is installed.
4. Tell the user exactly what needs to be installed.
5. Provide the installation command only as a suggestion for the user to run manually.
6. Continue with the coding task only if the required information is already available.

Examples of prohibited actions:

- `npm install`
- `npm uninstall`
- `pnpm add`
- `yarn add`
- `bun add`
- `pip install`
- `cargo add`
- `go get`
- `apt install`
- `pacman -S`
- `paru -S`
- `yay -S`
- Installing VS Code extensions.
- Installing system packages.
- Installing CLI tools.
- Installing runtimes or SDKs.
- Updating dependencies automatically.

The user is responsible for all installations.

If a dependency is required, report it like this:

> Required dependency: `<package-name>`
>
> Please install it manually before continuing.
>
> Suggested command:
> `<installation-command>`

The agent must NOT execute the suggested command.