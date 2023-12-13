## 1. Install required dependencies
```bash
$ npm install
```

## 2. Add environment variables
* Create a `.env` file by running the command in the terminal `touch .env`
* Copy the contents of the file `.env.example` to the `.env` file
* Update all environment variables in the `.env` file with the correct values
* If you're using Docker to run app, add environment variables to the *environment:* section of the `docker-compose.yml` file

## 3. Running the app
```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## 4. Running the app with Docker Compose
```bash
# Build and start containers (-d - detached mode (run app in background))
$ docker-compose up [-d] --build
```

**Helpful commands:**
```bash
# Stop any container
$ docker compose stop [container name]

# Restart (1 command instead of 2: stop + up) any container
$ docker compose restart [container name]

# stop all containers and remove volumes
$ docker compose down -v

# cleanup Docker (remove containers, volumes, etc)
$ docker compose down -v && docker system prune -af && docker volume prune -f
```

## 5. Run cron tasks 
Run cron tasks to fill DB with initial values for the past, present, and next day | week | month.
You should run each type of task [daily | weekly | monthly] for each time shift case [-1 | 0 | 1]. This ensures that there are values in the database to cover all timezones.
* -1 - past [day | week | month]
* 0 - current [day | week | month]
* 1 - next [day | week | month]
```bash
# cron task
$ npm run cron:task --task=[daily | weekly | monthly] --time_shift=[-1 | 0 | 1]
```

**For testing purposes (reducing the cost of OpenAI queries), follow these recommendations:**
* Run cron job for each period [day | week | month] and each time shift [-1 | 0 | 1] as shown in the example above (fill predictions for past, present, and next time period).
* Set env variable `RUN_FAKE_TASK=true` (reboot the server if necessary). It runs the *FakePredictionsService* service instead of the real Cron Task, which will change the date of the past prediction to the future one (yesterday's prediction makes tomorrow's prediction).
* In `production` mode, always use `RUN_FAKE_TASK=false`

## 6. Deploy to Google Cloud Platform
**Before working with Google Cloud Platform make sure:**
* You have installed the `gcloud CLI` before performing any operations (https://cloud.google.com/sdk/docs/install)
* Your gcloud CLI project is set:
```bash
# check the current active project
$ gcloud config get-value project

# check you're authenticated into the correct account
$ gcloud auth list

# authenticated in the account
$ gcloud config set account `ACCOUNT`

# list out the projects in the account
$ gcloud projects list

# switch to the intended project
$ gcloud config set project `PROJECT ID`
```


1. Deploy to *Google App Engine*
* Create a `app.yaml` file by running the command in the terminal `touch app.yaml`
* Copy the contents of the file `app.yaml.sample` to the `app.yaml` file
* Update all environment variables in the `app.yaml` file with the correct values
* Create a new project at https://console.cloud.google.com/ (or use an existing one)
* Enable `App Engine` service for you project
* Deploy project to `App Engine` with command `npm run gcp-deploy`

2. Deploy to *Google Cloud Run*
   <br />Google Cloud Run is used to build and deploy scalable containerized applications.
* Create and set up a `Dockerfile` and `docker-compose.yml`
* Enable `Cloud Run` service for you project
* Deploy project to `Cloud Run` with command `gcloud run deploy`
* It is also possible to add automated deployments with GitHub Actions. More info https://www.tomray.dev/deploy-nestjs-cloud-run#prepare-the-docker-image

3. Cloud Scheduler (**Optional**)
   <br />You can add config for cron jobs in Cloud Scheduler (**NOTE** - For *Google App Engine*, cron tasks in a project run automatically as normal, so you can skip this step):
* Create a `cron.yaml` file by running the command in the terminal `touch cron.yaml`
* Copy the contents of the file `cron.yaml.sample` to the `cron.yaml` file
* add correct instructions to `cron.yaml` (`cron.yaml.sample` contain correct instructions for current cron tasks in project)
* Enable `Cloud Scheduler` if it disabled
* Run command `npm run gcp-cron`
* Go to `Cloud Scheduler -> App Engine cron jobs`, you should see a list of cron jobs
* To delete all cron jobs, change the `cron.yaml` file to just contain: `cron:`, and run command `npm run gcp-cron`
* More info https://cloud.google.com/appengine/docs/flexible/scheduling-jobs-with-cron-yaml

## 7. Test
```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
