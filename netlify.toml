[build.environment]
  HUGO_VERSION = "0.124.0"

[build]
  publish = "exampleSite/public"
  command = "cd exampleSite && hugo --gc --minify"

[context.deploy-preview]
  command = "cd exampleSite && hugo --minify -D -F -b $DEPLOY_PRIME_URL"

[context.branch-deploy]
  command = "cd exampleSite && hugo --minify --gc -b $DEPLOY_PRIME_URL"