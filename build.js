import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { minify } from "terser";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, "package.json"), "utf8"));
const version = pkg.version || "0.0.0";

const SRC = path.join(__dirname, "src");
const DOCS = path.join(__dirname, "docs");
const OUTPUT = path.join(DOCS, `thyme@${version}.js`);

const read = (file) => fs.readFileSync(file, "utf8");

const minifyCSS = (css) =>
    css
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/\s+/g, " ")
        .replace(/\s*([{}:;,])\s*/g, "$1")
        .replace(/;}/g, "}")
        .trim();

const escapeCSS = (css) => minifyCSS(css).replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");

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
        .replace(/^import\s+.*?;\s*$/gm, "")
        .replace(/^export\s+(default\s+)?/gm, "")
        .replace(/^export\s+\{[^}]*\};\s*$/gm, "");

const resolveNamespaceImports = (code, filePath) => {
    return code.replace(/^import \* as (\w+) from ['"](.+?)['"];\s*$/gm, (_, name, modulePath) => {
        const abs = path.resolve(path.dirname(filePath), modulePath);
        if (!fs.existsSync(abs)) {
            console.warn(`[skip] namespace import ${modulePath} not found`);
            return `const ${name} = {};`;
        }
        const content = read(abs);
        const exports = [];
        const funcRe = /^export (?:default )?(?:function|const|let|var) (\w+)/gm;
        let m;
        while ((m = funcRe.exec(content)) !== null) exports.push(m[1]);
        const namedRe = /^export \{([^}]+)\};/gm;
        while ((m = namedRe.exec(content)) !== null) {
            m[1].split(",").forEach((s) => {
                const parts = s.trim().split(/\s+as\s+/);
                exports.push(parts[parts.length - 1].trim());
            });
        }
        return `const ${name} = { ${exports.map((e) => e + ": " + e).join(", ")} };`;
    });
};

const minifyTemplateLiterals = (code) => {
    let result = "";
    let i = 0;
    const next = () => (i < code.length ? code[i++] : "");
    const peek = () => code[i] || "";
    const parseExpr = () => {
        let expr = "",
            depth = 1;
        while (i < code.length && depth > 0) {
            if (code[i] === "{") depth++;
            else if (code[i] === "}") {
                depth--;
                if (depth === 0) break;
            }
            expr += code[i++];
        }
        return expr;
    };
    while (i < code.length) {
        if (code[i] === "`") {
            result += "`";
            i++;
            const parts = [];
            let buf = "";
            while (i < code.length) {
                if (code[i] === "\\") {
                    buf += code[i] + code[i + 1];
                    i += 2;
                } else if (code[i] === "$" && code[i + 1] === "{") {
                    parts.push({ t: "h", v: buf });
                    buf = "";
                    i += 2;
                    const expr = parseExpr();
                    parts.push({ t: "e", v: minifyTemplateLiterals(expr) });
                    i++;
                } else if (code[i] === "`") {
                    parts.push({ t: "h", v: buf });
                    const collapsed = parts
                        .map((p) => (p.t === "h" ? p.v.replace(/\s+/g, " ") : "${" + p.v + "}"))
                        .join("");
                    result += collapsed.replace(/>\s+</g, "><").trim();
                    result += "`";
                    i++;
                    break;
                } else {
                    buf += code[i++];
                }
            }
        } else {
            result += code[i++];
        }
    }
    return result;
};

const parts = [];

for (const file of ["utils.js", "locale.js", "form.js", "http.js", "Component.js"]) {
    parts.push(stripModuleSyntax(read(path.join(SRC, "core", file))));
}

for (const name of ["th-button", "th-field", "th-switch", "th-check", "th-select", "th-dialog", "th-toast"]) {
    const jsPath = path.join(SRC, "components", `${name}.js`);
    if (fs.existsSync(jsPath)) {
        let js = read(jsPath);
        js = resolveCssImports(js, jsPath);
        js = stripModuleSyntax(js);
        parts.push(js);
    }
}

const mainPath = path.join(SRC, "main.js");
if (fs.existsSync(mainPath)) {
    let mainCode = read(mainPath);
    mainCode = resolveNamespaceImports(mainCode, mainPath);
    parts.push(stripModuleSyntax(mainCode));
}

(async () => {
    let code = minifyTemplateLiterals(parts.join("\n"));
    const result = await minify(code, {
        compress: {
            passes: 3,
            toplevel: true,
            unsafe: true,
            unsafe_arrows: true,
            unsafe_methods: true,
            booleans_as_integers: true,
        },
        mangle: {
            toplevel: true,
        },
        format: { comments: false },
    });
    if (result.error) {
        console.error("Minify error:", result.error);
        process.exit(1);
    }
    fs.writeFileSync(OUTPUT, result.code, "utf8");
    console.log(`Done: ${OUTPUT} (${result.code.length} bytes)`);
})();
