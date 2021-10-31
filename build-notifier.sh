#!/bin/sh
set -e
echo "Start: build-notifier.sh"

# Install jq
apt-get update && apt-get install -y jq

# Write pipeline vars
PIPE_VARS=$( jq -n \
                   --arg CI $CI \
                   --arg BITBUCKET_BUILD_NUMBER $BITBUCKET_BUILD_NUMBER \
                   --arg BITBUCKET_CLONE_DIR "$BITBUCKET_CLONE_DIR" \
                   --arg BITBUCKET_COMMIT "$BITBUCKET_COMMIT" \
                   --arg BITBUCKET_WORKSPACE "$BITBUCKET_WORKSPACE" \
                   --arg BITBUCKET_REPO_SLUG "$BITBUCKET_REPO_SLUG" \
                   --arg BITBUCKET_REPO_UUID $BITBUCKET_REPO_UUID \
                   --arg BITBUCKET_REPO_FULL_NAME "$BITBUCKET_REPO_FULL_NAME" \
                   --arg BITBUCKET_BRANCH "$BITBUCKET_BRANCH" \
                   --arg BITBUCKET_TAG "$BITBUCKET_TAG" \
                   --arg BITBUCKET_BOOKMARK "$BITBUCKET_BOOKMARK" \
                   --arg BITBUCKET_PARALLEL_STEP "$BITBUCKET_PARALLEL_STEP" \
                   --arg BITBUCKET_PARALLEL_STEP_COUNT "$BITBUCKET_PARALLEL_STEP_COUNT" \
                   --arg BITBUCKET_PR_ID "$BITBUCKET_PR_ID" \
                   --arg BITBUCKET_PR_DESTINATION_BRANCH "$BITBUCKET_PR_DESTINATION_BRANCH" \
                   --arg BITBUCKET_GIT_HTTP_ORIGIN "$BITBUCKET_GIT_HTTP_ORIGIN" \
                   --arg BITBUCKET_GIT_SSH_ORIGIN "$BITBUCKET_GIT_SSH_ORIGIN" \
                   --arg BITBUCKET_EXIT_CODE "$BITBUCKET_EXIT_CODE" \
                   --arg BITBUCKET_STEP_UUID $BITBUCKET_STEP_UUID \
                   --arg BITBUCKET_PIPELINE_UUID $BITBUCKET_PIPELINE_UUID \
                   --arg BITBUCKET_DEPLOYMENT_ENVIRONMENT "$BITBUCKET_DEPLOYMENT_ENVIRONMENT" \
                   --arg BITBUCKET_DEPLOYMENT_ENVIRONMENT_UUID "$BITBUCKET_DEPLOYMENT_ENVIRONMENT_UUID" \
                   --arg BITBUCKET_PROJECT_KEY "$BITBUCKET_PROJECT_KEY" \
                   --arg BITBUCKET_PROJECT_UUID $BITBUCKET_PROJECT_UUID \
                   --arg BITBUCKET_STEP_TRIGGERER_UUID $BITBUCKET_STEP_TRIGGERER_UUID \
                   --arg BITBUCKET_STEP_OIDC_TOKEN "$BITBUCKET_STEP_OIDC_TOKEN" \
                   '{CI: $CI, BITBUCKET_BUILD_NUMBER: $BITBUCKET_BUILD_NUMBER, BITBUCKET_CLONE_DIR: $BITBUCKET_CLONE_DIR, BITBUCKET_COMMIT: $BITBUCKET_COMMIT, BITBUCKET_WORKSPACE: $BITBUCKET_WORKSPACE, BITBUCKET_REPO_SLUG: $BITBUCKET_REPO_SLUG, BITBUCKET_REPO_UUID: $BITBUCKET_REPO_UUID, BITBUCKET_REPO_FULL_NAME: $BITBUCKET_REPO_FULL_NAME, BITBUCKET_BRANCH: $BITBUCKET_BRANCH, BITBUCKET_TAG: $BITBUCKET_TAG, BITBUCKET_BOOKMARK: $BITBUCKET_BOOKMARK, BITBUCKET_PARALLEL_STEP: $BITBUCKET_PARALLEL_STEP, BITBUCKET_PARALLEL_STEP_COUNT: $BITBUCKET_PARALLEL_STEP_COUNT, BITBUCKET_PR_ID: $BITBUCKET_PR_ID, BITBUCKET_PR_DESTINATION_BRANCH: $BITBUCKET_PR_DESTINATION_BRANCH, BITBUCKET_GIT_HTTP_ORIGIN: $BITBUCKET_GIT_HTTP_ORIGIN, BITBUCKET_GIT_SSH_ORIGIN: $BITBUCKET_GIT_SSH_ORIGIN, BITBUCKET_EXIT_CODE: $BITBUCKET_EXIT_CODE, BITBUCKET_STEP_UUID: $BITBUCKET_STEP_UUID, BITBUCKET_PIPELINE_UUID: $BITBUCKET_PIPELINE_UUID, BITBUCKET_DEPLOYMENT_ENVIRONMENT: $BITBUCKET_DEPLOYMENT_ENVIRONMENT, BITBUCKET_DEPLOYMENT_ENVIRONMENT_UUID: $BITBUCKET_DEPLOYMENT_ENVIRONMENT_UUID, BITBUCKET_PROJECT_KEY: $BITBUCKET_PROJECT_KEY, BITBUCKET_PROJECT_UUID: $BITBUCKET_PROJECT_UUID, BITBUCKET_STEP_TRIGGERER_UUID: $BITBUCKET_STEP_TRIGGERER_UUID, BITBUCKET_STEP_OIDC_TOKEN: $BITBUCKET_STEP_OIDC_TOKEN}' )

echo $PIPE_VARS > ./.pipe-vars.json

# Install dependencies
npm i

# Run nodejs build notifier
node ./build-notifier.js $NOTIFIER_WEBHOOK $1

echo "End: build-notifier.sh"
