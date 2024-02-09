# GitHub Project Labeling Webhook

Manage your issues with GitHub project labels. When you add an issue to a project, this webhook will automatically add the project's status to the issue. Same thing when you move an project card to another status, the webhook will update the issue's label.

## Prerequisites

### GitHub App

Steps to create the GitHub App:

1. Create a new GitHub App
1. Activate the webhook
1. Set the webhook URL and secret
1. Set the permissions
    - Repository permissions:
      - Issues: Read & write
      - Metadata: Read-only
    - Organization permissions:
      - Projects: Read-only
1. Subscribe to events
    - Project v2 item
1. Create a private key

Things we need for the Azure Functions:

- GitHub App ID
- GitHub App Private Key
- Webhook Secret

Install the app to the organization and personal account.
