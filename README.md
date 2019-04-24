# 4/21/2019 3:34 AM

Successfully completed a round-trip from `git push` to a `docker build` as follows:

- `git push` to github.com
- git webook calls `POST http://palkosoftware.ddns.net/api/v1/hooks`
- frank API
  - parses the repository name from hook JSON
  - looks up a saved deployment configuration by `name`
  - captures `local_path` and `image_name` from the deployment configuration
  - `tar`s the path and calls `docker.image.build`

# Architecture

Frank API container with bind volumes for `/var/run/docker.sock` and the
local project code folder. Containerized database holds project deployment
configurations with project name and local path from that code folder.

github.com webhook configured to call Frank API on push.

# Development

- write deployment target runners
  - current is local development (no tag)
  - need tag management / responsiveness
  - need remote deployment (heroku, aws)
  - need script packaging / placement
- break off builder container
- docker build from git repo URL
- queue builds from webhook call
