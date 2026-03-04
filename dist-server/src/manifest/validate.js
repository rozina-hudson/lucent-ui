function err(field, message) {
    return { field, message };
}
/**
 * Validates a ComponentManifest object at runtime.
 * Returns a result object — does not throw.
 *
 * @example
 * const result = validateManifest(ButtonManifest);
 * if (!result.valid) console.error(result.errors);
 */
export function validateManifest(manifest) {
    const errors = [];
    if (typeof manifest !== 'object' || manifest === null) {
        return { valid: false, errors: [err('manifest', 'Must be a non-null object')] };
    }
    const m = manifest;
    // Required string fields
    const requiredStrings = ['id', 'name', 'description', 'designIntent', 'specVersion'];
    for (const field of requiredStrings) {
        if (typeof m[field] !== 'string' || m[field].trim() === '') {
            errors.push(err(field, `Must be a non-empty string`));
        }
    }
    // id: kebab-case
    if (typeof m['id'] === 'string' && !/^[a-z][a-z0-9-]*$/.test(m['id'])) {
        errors.push(err('id', 'Must be kebab-case (e.g. "button", "form-field")'));
    }
    // tier
    const validTiers = ['atom', 'molecule', 'block', 'flow', 'overlay'];
    if (!validTiers.includes(m['tier'])) {
        errors.push(err('tier', `Must be one of: ${validTiers.join(', ')}`));
    }
    // domain
    if (typeof m['domain'] !== 'string' || m['domain'].trim() === '') {
        errors.push(err('domain', 'Must be a non-empty string'));
    }
    // props
    if (!Array.isArray(m['props'])) {
        errors.push(err('props', 'Must be an array'));
    }
    else {
        m['props'].forEach((prop, i) => {
            const p = prop;
            const prefix = `props[${i}]`;
            if (typeof p['name'] !== 'string' || p['name'] === '')
                errors.push(err(`${prefix}.name`, 'Must be a non-empty string'));
            if (typeof p['type'] !== 'string' || p['type'] === '')
                errors.push(err(`${prefix}.type`, 'Must be a non-empty string'));
            if (typeof p['required'] !== 'boolean')
                errors.push(err(`${prefix}.required`, 'Must be a boolean'));
            if (typeof p['description'] !== 'string' || p['description'] === '')
                errors.push(err(`${prefix}.description`, 'Must be a non-empty string'));
        });
    }
    // usageExamples
    if (!Array.isArray(m['usageExamples'])) {
        errors.push(err('usageExamples', 'Must be an array'));
    }
    else if (m['usageExamples'].length === 0) {
        errors.push(err('usageExamples', 'Must have at least one example'));
    }
    else {
        m['usageExamples'].forEach((ex, i) => {
            const e = ex;
            const prefix = `usageExamples[${i}]`;
            if (typeof e['title'] !== 'string' || e['title'] === '')
                errors.push(err(`${prefix}.title`, 'Must be a non-empty string'));
            if (typeof e['code'] !== 'string' || e['code'] === '')
                errors.push(err(`${prefix}.code`, 'Must be a non-empty string'));
        });
    }
    // compositionGraph
    if (!Array.isArray(m['compositionGraph'])) {
        errors.push(err('compositionGraph', 'Must be an array (empty array is fine for atoms)'));
    }
    // specVersion
    if (typeof m['specVersion'] === 'string' && !/^\d+\.\d+$/.test(m['specVersion'])) {
        errors.push(err('specVersion', 'Must be "MAJOR.MINOR" format, e.g. "0.1"'));
    }
    return { valid: errors.length === 0, errors };
}
/**
 * Asserts a manifest is valid. Throws a descriptive error if not.
 * Use in tests or at component module load time.
 */
export function assertManifest(manifest) {
    const result = validateManifest(manifest);
    if (!result.valid) {
        const messages = result.errors.map(e => `  ${e.field}: ${e.message}`).join('\n');
        throw new Error(`Invalid ComponentManifest:\n${messages}`);
    }
}
export function isValidPropDescriptor(prop) {
    if (typeof prop !== 'object' || prop === null)
        return false;
    const p = prop;
    return (typeof p['name'] === 'string' &&
        typeof p['type'] === 'string' &&
        typeof p['required'] === 'boolean' &&
        typeof p['description'] === 'string');
}
