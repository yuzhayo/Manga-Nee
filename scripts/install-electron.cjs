const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const electronDir = path.join(__dirname, '..', 'node_modules', 'electron');
const version = require(path.join(electronDir, 'package.json')).version;
const mirror = process.env.ELECTRON_MIRROR || 'https://npmmirror.com/mirrors/electron/';
const customDir = process.env.ELECTRON_CUSTOM_DIR || version;
const localSeedDir = process.env.ELECTRON_LOCAL_SEED_DIR || 'D:\\ARTIFACT\\electron-cache';

function platformInfo() {
    const platform = process.env.ELECTRON_INSTALL_PLATFORM || process.platform;
    const arch = process.env.ELECTRON_INSTALL_ARCH || process.arch;
    const executable = platform === 'win32'
        ? 'electron.exe'
        : platform === 'darwin'
            ? 'Electron.app/Contents/MacOS/Electron'
            : 'electron';
    return { platform, arch, executable };
}

function isInstalled(executable) {
    try {
        const installedVersion = fs
            .readFileSync(path.join(electronDir, 'dist', 'version'), 'utf8')
            .trim()
            .replace(/^v/, '');
        return installedVersion === version
            && fs.existsSync(path.join(electronDir, 'dist', executable));
    } catch {
        return false;
    }
}

function download(url, destination) {
    console.log(`[install-electron] Downloading via curl: ${url}`);
    execFileSync('curl', [
        '-L', '-C', '-',
        '--retry', '15',
        '--retry-delay', '3',
        '--retry-all-errors',
        '--connect-timeout', '20',
        '-o', destination,
        url,
    ], { stdio: 'inherit' });
}

function main() {
    const { platform, arch, executable } = platformInfo();
    if (isInstalled(executable)) {
        console.log('[install-electron] Already installed, skipping.');
        return;
    }

    const archiveName = `electron-v${version}-${platform}-${arch}.zip`;
    const archivePath = path.join(os.tmpdir(), archiveName);
    const seedPath = path.join(localSeedDir, archiveName);

    if (fs.existsSync(seedPath)) {
        console.log(`[install-electron] Using local seed: ${seedPath}`);
        fs.copyFileSync(seedPath, archivePath);
    } else {
        try {
            download(`${mirror}${customDir}/${archiveName}`, archivePath);
        } catch (error) {
            console.error('[install-electron] curl failed; using Electron default installer.');
            console.error(error instanceof Error ? error.message : error);
            execFileSync(process.execPath, [path.join(electronDir, 'install.js')], {
                stdio: 'inherit',
            });
            return;
        }
    }

    const distDir = path.join(electronDir, 'dist');
    fs.mkdirSync(distDir, { recursive: true });
    console.log('[install-electron] Extracting...');
    execFileSync('tar', ['-xf', archivePath, '-C', distDir], { stdio: 'inherit' });
    fs.writeFileSync(path.join(distDir, 'version'), `v${version}`);
    fs.writeFileSync(path.join(electronDir, 'path.txt'), executable);
    console.log('[install-electron] Done.');
}

main();
