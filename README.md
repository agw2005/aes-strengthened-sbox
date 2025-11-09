# Commit Guidelines

This project uses the form of type `[PURPOSE]([SCOPE]):[MESSAGE]`

`[PURPOSE]` refers to the purpose of the commit, the content is according to the
table below.

| PURPOSE-value | Description                                                                                             |
| ------------- | ------------------------------------------------------------------------------------------------------- |
| feat          | When changes adds a new feature or functionality                                                        |
| fix           | When changes fixes a bug in the codebase                                                                |
| chore         | When changes doesn't affect code logic, such as updating dependencies, CI/CD configurations, or scripts |
| refactor      | When changes improve the code without changing functionality                                            |
| docs          | When the changes updates the documentation                                                              |

`[SCOPE]` indicates the name of the file(s) that is changed.

`[MESSAGE]` is a short summary plus occasionally a long explanation or reference
to other relative issues

```bash
# Good commit message following conventional guidelines
git commit -m "feat(auth.js): add JWT-based authentication"
git commit -m "fix(login.jsx): resolve race condition in login flow"
```

## 2. Atomic & Focused

Do not mix several independent changes in one commit.

```bash
# Good commit
git commit -m "Add user authentication"

# Bad commit
git commit -m "Add user authentication AND update UI styles"
```

## 3. Descriptive Message

What the commit does and why the change was made.

```bash
# Good commit message
git commit -m "Fix Correct null pointer exception in user login"
# Bad commit message
git commit -m "Fix bug"
```
