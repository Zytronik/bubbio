# Blubb.io | Desktop

## WSL Ubuntu

### References

- https://gitlab.winehq.org/wine/wine/-/wikis/Debian-Ubuntu
- https://www.mono-project.com/download/stable/#download-lin-ubuntu
- https://www.electronforge.io/guides/developing-with-wsl

### Build

> [!NOTE]
> You need to have `mono` and `wine` installed to proceed, follow the referenced install guides

If node_modules exists already that was installed in WSL

```sh
rm -r node_modules
```

then

```sh
npm install --platform=win32
```

Build the desktop app

```sh
npm run make -- --platform=win32
```

### Run

Run the app (on Windows)

> [!NOTE]
> You need to move the `blubbio-win32-x64` to the `C:` drive.
> Otherwise, your GPU will be blocked and WebGL won't be available.
