# Zapier Flow Platform

This is a basic implementation of the [Flow API](https://developer.getflow.com/) for use with Zapier. It's a pretty basic start but PRs are welcome.

## Requirements
- NodeJS v8.10.0 (use [nvm](https://github.com/creationix/nvm) to manage Node as Zapier requires specific Node versions)
- [Zapier Platform CLI](https://github.com/zapier/zapier-platform-cli)

## Quick Start
First, you'll need to install the Zapier Platform CLI if you don't already have it.

```bash
# install the CLI globally on your machine
npm install -g zapier-platform-cli

# authorize yourself to Zapier
zapier login
```

The Zapier CLI should be installed and you're ready to get started. Now, let's start working on our app!
```bash
# clone this repository
git clone https://github.com/tripleerv/zapier-flow.git

# move into the new direactory
cd zapier-flow

# install dependencies
npm install
```

Now, make some changes to the code. Once you're ready to push a new version, you should validate it.

```bash
zapier validate
```

If it passes validation, you can push the new version to Zapier so you can start testing live.

```bash
zapier push
```
