<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:git-identity-rules -->
## Git identity and push guard

Only `gray237 <grayleft21@gmail.com>` is authorized for commits and pushes in this repository.

Before every commit or push, verify:

```bash
git config --get user.name
git config --get user.email
git config --get remote.origin.url
git log -1 --format='%an <%ae>'
```

Required values:
- `user.name`: `gray237`
- `user.email`: `grayleft21@gmail.com`
- `remote.origin.url`: `git@github-gray237:gray237/visa-expeditor.git`

Never commit or push as `motomenda` / `motomenda@gmail.com`, and never add `motomenda` as a collaborator or author. If any check fails, stop and ask before proceeding.
<!-- END:git-identity-rules -->
