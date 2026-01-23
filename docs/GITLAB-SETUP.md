# GitLab Setup

This guide covers setting up GitLab integration for the Customer Portal UI project.

## Create Personal Access Token

### Required Scopes

The GitLab token needs the following permissions:

- `api` - Full API access (required for all GitLab operations)
- `read_repository` - Read repository code and metadata

### Steps

1. Navigate to [GitLab Personal Access Tokens](https://gitlab.eurochem.ru/-/user_settings/personal_access_tokens)
2. Click **"Add new token"** button
3. Configure the token:
   - **Name**: `customer-portal-ui` (or any descriptive name)
   - **Expiration date**: Recommended 90 days or longer for development
   - **Scopes**: Check `api` and `read_repository`
4. Click **"Create personal access token"**
5. **Important**: Copy the token immediately - you won't see it again!

## Configure Environment Variables

Add the token to your environment:

### Option 1: `.env.development.local` (Recommended for local development)

```bash
# .env.development.local
GITLAB_TOKEN=glpat-xxxxxxxxxxxxxxx
```

### Option 2: `.env.development` (Shared across team)

```bash
# .env.development
GITLAB_TOKEN=glpat-xxxxxxxxxxxxxxx
```

### Option 3: Shell Environment (Temporary)

```bash
export GITLAB_TOKEN=glpat-xxxxxxxxxxxxxxx
```

> **Note**: The `.env.development.local` file is git-ignored, making it ideal for personal tokens that shouldn't be committed.

## Verify Configuration

Test that your GitLab configuration is working:

```bash
# View MR details
npm run gitlab:mr:view -- --mr 320

# Get unresolved comments
npm run gitlab:unresolved-comments -- --mr 320
```

If you see an error about missing or invalid configuration, double-check:

1. Token has correct scopes (`api`, `read_repository`)
2. Token is not expired
3. Environment variable is set correctly
4. `.env.development.local` file exists (if using that option)

## Available Scripts

This project includes several GitLab integration scripts:

| Script                       | Purpose                    | Example                                                                  |
| ---------------------------- | -------------------------- | ------------------------------------------------------------------------ |
| `gitlab:mr:view`             | View MR details            | `npm run gitlab:mr:view -- --mr 320`                                     |
| `gitlab:unresolved-comments` | Get open inline comments   | `npm run gitlab:mr:view -- --mr 320 --inline-only`                       |
| `gitlab:mr:reply`            | Reply to discussion thread | `npm run gitlab:mr:reply -- --mr 320 --discussion-id xxx --body "Fixed"` |

## Troubleshooting

### Error: "Invalid GitLab configuration: token: GITLAB_TOKEN is required"

**Solution**: Set the GITLAB_TOKEN environment variable (see "Configure Environment Variables" above).

### Error: "Failed to fetch MR details: HTTP 401"

**Solution**: Your token may be:

- Expired - create a new one
- Invalid - verify you copied it correctly
- Missing required scopes - recreate with `api` and `read_repository`

### Error: "Failed to fetch MR details: HTTP 404"

**Solution**: Check that:

- The MR number is correct
- You have access to the repository
- The project ID is correct in `.env.development` (default: `customer-portal/front`)

## Security Best Practices

- ✅ **Do**: Use `.env.development.local` for personal tokens
- ✅ **Do**: Set expiration dates on tokens
- ✅ **Do**: Revoke old tokens when they're no longer needed
- ❌ **Don't**: Commit tokens to git
- ❌ **Don't**: Share tokens in chat/email
- ❌ **Don't**: Use tokens in production CI/CD (use project-level tokens)

## Additional Resources

- [GitLab Personal Access Tokens Documentation](https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html)
- [GitLab API Documentation](https://docs.gitlab.com/ee/api/)
- [Project README](../README.md) - Quick start guide
- [Development Guide](./DEVELOPMENT.md) - Full development setup

---

**Need help?** Check the [Development Guide](./DEVELOPMENT.md) or open an issue in the project.
