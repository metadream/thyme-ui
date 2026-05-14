const fs = require('fs');
const path = require('path');
const Terser = require('terser');

const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
const version = pkg.version || '0.0.0';

const SRC = path.join(__dirname, 'src');
const DOCS = path.join(__dirname, 'docs');
const OUTPUT = path.join(DOCS, `thyme@${version}.js`);

const read = (file) => fs.readFileSync(file, 'utf8');

const minifyCSS = (css) => css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}:;,])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim();

const escapeCSS = (css) => minifyCSS(css)
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$\{/g, '\\${');

const resolveCssImports = (code, filePath) => {
    return code.replace(/^import\s+(\w+)\s+from\s+['"](.+\.css)['"];\s*$/gm, (_, name, cssPath) => {
        const abs = path.resolve(path.dirname(filePath), cssPath);
        if (!fs.existsSync(abs)) {
            console.warn(`[skip] ${cssPath} not found`);
            return `const ${name} = '';`;
        }
        return `const ${name} = \`${escapeCSS(read(abs))}\`;`;
    });
};

const stripModuleSyntax = (code) =>
    code
        .replace(/^import\s+.*?;\s*$/gm, '')
        .replace(/^export\s+(default\s+)?/gm, '')
        .replace(/^export\s+\{[^}]*\};\s*$/gm, '');

const parts = [];

for (const file of ['utils.js', 'locale.js', 'form.js', 'http.js', 'Component.js']) {
    parts.push(stripModuleSyntax(read(path.join(SRC, 'core', file))));
}

for (const name of ['th-button', 'th-field', 'th-switch', 'th-check', 'th-select', 'th-dialog', 'th-toast']) {
    const jsPath = path.join(SRC, 'components', `${name}.js`);
    if (fs.existsSync(jsPath)) {
        let js = read(jsPath);
        js = resolveCssImports(js, jsPath);
        js = stripModuleSyntax(js);
        parts.push(js);
    }
}

const mainPath = path.join(SRC, 'main.js');
if (fs.existsSync(mainPath)) {
    parts.push(stripModuleSyntax(read(mainPath)));
}

(async () => {
    const result = await Terser.minify(parts.join('\n'), {
        compress: { passes: 2 },
        mangle: true,
        format: { comments: false }
    });
    if (result.error) {
        console.error('Minify error:', result.error);
        process.exit(1);
    }
    fs.writeFileSync(OUTPUT, result.code, 'utf8');
    console.log(`Done: ${OUTPUT} (${result.code.length} bytes)`);
})();

