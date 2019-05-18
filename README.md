# Tahobuddy

(Ta)g (Ho)ok (Bu)il(d) (D)eplo(y)

Tag a commit
See that tag in a webhook call
Build and deploy the thing based on the tag

Working on a development branch and PR'ing commits to master.
Configure the development branch to be deployed locally as a docker container on every commit.
Configure the master branch to be deployed to heroku when it sees a `release-*` tag.
Push a development branch commit.
Webhook calls Tahobuddy API
  - database insert body of event
  - examines tags on the commit
  - database lookup by application name and tag in deploy configurations
  - PUT found deploy configuration back at Tahobuddy API
Tahobuddy calls Tahobuddy API
  - from deploy configuration, dispatch correct builder container with build instructions

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
local project code folder. Database holds project deployment
configurations with project name and local path from that code folder.

github.com webhook configured to call Frank API on push.

# Development

1. develop configurable tag management to drive builds
2. write deployment target runners
  - currently supported: local deployment by command-line build or docker image build/run
  - need remote deployment (heroku, aws, ansible, chef)
  - need script packaging / placement - basically all variants of building and deployment
3. docker build from git repo URL
  - currently requires API container have a volume bind containing a clone
  - deploy model will use `repo_url` instead of `local_path`
4. general build process improvement
  - build queue, queue management endpoints, queue runner (pub-sub?)
  - build in docker
  - hook POST verifies and calls queue endpoint
  - manage concurrency/quiet period for a single deploy/target
  - manage (pool of?) build containers
  - support rolling deployments

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

# Appendix B: From Google Docs

Application Realm
  - Containers:
    - Proxy
      - Dependencies:
        - For each app:
          - Hostname
          - Request location
          - App exposed port
          - Docker service name
        - Bridge network
        - Functions:
          - Serves apps over 80/443
          - Useful for NATd hosting
    - N apps
      - Dependencies:
        - Database host (docker service name)
        - Bridge network
    - N databases
      - Dependencies:
        - Bridge network

Management
  - Network: another bridge
  - Containers:
    - API
      - Dependencies:
        - /var/run/docker.sock volume
        - Expose its port
        - Database link
      - Endpoints:
        - POST /hook
        - POST /deploy
      - Functions:
        - App deploy CRUD
        - Hook Target
        - Queue management
        - Proxy management
    - Database
      - Model:
        - App name
        - Hostname
        - App exposed port
        - Request location
        - Repo URL
        - Database instance type
        - Deployment Tags
          - String match/name
          - Target type
    - Builders
      - one per Target type (local, heroku, aws)
      - Spun up from queue by API backend
    - Queue
      - Managed by API backend

General Deployment - Ansible (Docker, confd, etcd)
