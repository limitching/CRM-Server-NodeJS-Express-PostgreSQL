# Cursor Rules & Pre-Commit Compliance

This directory contains Cursor IDE rules and automated compliance checking for the CRM Server project.

## Available Rules

### 1. update-docs-on-code-change.mdc
- **Purpose**: Ensures documentation stays synchronized with code changes
- **Triggers**: When JavaScript source files, configuration files, or database models are modified
- **Actions**: Prompts to update README.md, API documentation, and other relevant docs

### 2. security-scan-precommit.mdc
- **Purpose**: Scans for security vulnerabilities before commits
- **Triggers**: Before any commit involving source code or configuration files
- **Actions**: Security analysis and recommendations for secure coding practices

## Pre-Commit Automation

### Git Pre-Commit Hook
A Git pre-commit hook has been configured to automatically check cursor rules compliance:

```bash
# The hook will run automatically before each commit
git commit -m "your message"
```

### What the Hook Checks
1. **File Type Validation**: Ensures relevant files trigger appropriate rules
2. **Documentation Updates**: Checks if code changes include documentation updates
3. **Security Scanning**: Verifies security hooks are available
4. **Rule Compliance**: Ensures all cursor rules are properly configured

### Manual Rule Triggering
If you need to manually trigger cursor rules:

1. **Documentation Updates**:
   ```bash
   # Check if you need to update docs
   # Review .kiro/hooks/update-docs-on-code-change.kiro.hook
   ```

2. **Security Scanning**:
   ```bash
   # Run security checks
   # Review .kiro/hooks/security-scan-precommit.kiro.hook
   ```

3. **Full Compliance Check**:
   ```bash
   # Complete compliance verification
   # Review .kiro/hooks/cursor-rules-precommit.kiro.hook
   ```

## Compliance Checklist

Before each commit, ensure you've completed:

- [ ] **Documentation Standards**: Updated relevant docs for code changes
- [ ] **Code Style**: Followed ES6+ standards and project conventions
- [ ] **Security**: No hardcoded secrets or security vulnerabilities
- [ ] **Testing**: Changes thoroughly tested
- [ ] **Workflow**: All .kiro hooks satisfied

## Troubleshooting

### Hook Not Running
```bash
# Check if hook is executable
ls -la .git/hooks/pre-commit

# Make executable if needed
chmod +x .git/hooks/pre-commit
```

### Rules Not Found
```bash
# Verify cursor rules exist
ls -la .cursor/rules/

# Verify kiro hooks exist
ls -la .kiro/hooks/
```

### Manual Compliance Check
If automated checks fail, manually review:
1. `.cursor/rules/*.mdc` files
2. `.kiro/hooks/*.kiro.hook` files
3. Project documentation standards
4. Security best practices

## Best Practices

1. **Always run pre-commit checks** before committing
2. **Update documentation** when adding new features
3. **Follow security guidelines** for CRM data handling
4. **Test thoroughly** before committing changes
5. **Use environment variables** for configuration
6. **Maintain consistent code style** across the project
