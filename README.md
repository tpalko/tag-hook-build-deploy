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

1. develop configurable tag management to drive builds
2. write deployment target runners
  - current is local development (no tag)
  - need remote deployment (heroku, aws)
  - need script packaging / placement
3. break off builder container
4. docker build from git repo URL
  - currently requires API container have a volume bind containing a clone
  - deploy model will swap out `local_path` for `repo_url`
5. queue builds from webhook call
  - expose API endpoint for queuing builds
  - hook POST verifies and calls queue endpoint
  - pub/sub worker pulls and runs
  - manage concurrency/quiet period for a single deploy/target

# Appendix A: docker image

RUN apt-get -y install apt-transport-https \
     ca-certificates \
     curl \
     gnupg2 \
     software-properties-common
RUN curl -fsSL https://download.docker.com/linux/$(. /etc/os-release; echo "$ID")/gpg > /tmp/dkey; apt-key add /tmp/dkey && \
  add-apt-repository \
     "deb [arch=amd64] https://download.docker.com/linux/$(. /etc/os-release; echo "$ID") \
     $(lsb_release -cs) \
     stable"
RUN apt-get -y update && apt-get -y upgrade && apt-get -y install docker-ce
