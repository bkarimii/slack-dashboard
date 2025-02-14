# 📊 Slack Activity Dashboard

[![GitHub stars](https://img.shields.io/github/stars/bkarimii/slack-dashboard)](https://github.com/bkarimii/slack-dashboard/stargazers)
[![GitHub last commit](https://img.shields.io/github/last-commit/bkarimii/slack-dashboard)](https://github.com/bkarimii/slack-dashboard/commits/main)
[![GitHub issues](https://img.shields.io/github/issues/bkarimii/slack-dashboard)](https://github.com/bkarimii/slack-dashboard/issues)
[![GitHub forks](https://img.shields.io/github/forks/bkarimii/slack-dashboard)](https://github.com/bkarimii/slack-dashboard/network/members)
[![GitHub contributors](https://img.shields.io/github/contributors/bkarimii/slack-dashboard?color=blue)](https://github.com/bkarimii/slack-dashboard/graphs/contributors)
[![GitHub license](https://img.shields.io/github/license/bkarimii/slack-dashboard)](https://github.com/bkarimii/slack-dashboard/blob/main/LICENSE)

[![Slack](https://img.shields.io/badge/slack-%20-blue)](https://slack.com/)
[![GitHub pull requests](https://img.shields.io/github/pulls/bkarimii/slack-dashboard)](https://github.com/bkarimii/slack-dashboard/pulls)

## Links

- **[View on GitHub](https://github.com/bkarimii/slack-dashboard)**
- **[Download ZIP](https://github.com/bkarimii/slack-dashboard/archive/refs/heads/main.zip)**
- **[Open an Issue](https://github.com/bkarimii/slack-dashboard/issues)**
- **[Submit a Pull Request](https://github.com/bkarimii/slack-dashboard/pulls)**
- **[Documentation](https://github.com/bkarimii/slack-dashboard/wiki)**

## 📌 Overview

Slack is the main communication hub for the CYF (CodeYourFuture) community. With a high volume of messages and calls across multiple groups and channels, it can be difficult to track **who is active** and **how much they are engaging**. This project provides a **Slack Activity Dashboard** to monitor communication levels, ensuring that no one goes silent and that trainees stay engaged.

## 🔥 Features

- 📊 **Track Slack Activity** – See who is active, how often they communicate, and their level of engagement.
- 👥 **Cohort Management** – Group trainees based on regions, Slack channels, and engagement levels.
- 📌 **Trainee Profiles** – View individual statistics on messages and calls per week.
- 🎯 **Mentor Dashboard** – Set communication targets for trainees and track their progress.
- 🔔 **Notifications** _(Stretch Goal)_ – Prompt trainees to re-engage if inactive.
- 🔗 **Integrations** _(Stretch Goal)_ – Sync data with Google Sheets for extended tracking.

## 🛠 Tech Stack

- **Backend**: Node.js (LTS), Express.js, PostgreSQL (via `pg`)
- **Frontend**: React (with Vite), React Router
- **Testing**: Jest, Vitest, SuperTest, TestContainers, Playwright (E2E)
- **Logging**: Winston, Morgan
- **CI/CD**: GitHub Actions
- **Deployment**: Google App Engine, Heroku, Render, Vercel
- **Containerisation**: Docker

## ⚙️Installation & Setup

### Prerequisites

- Install [Node.js LTS](https://nodejs.org/en/)
- Install [Docker](https://www.docker.com/)
- Install [PostgreSQL](https://www.postgresql.org/)
- Install dependencies:
  ```sh
  npm install
  ```

### Running Locally

1. **Start the Backend:**
   ```sh
   npm run dev
   ```
2. **Start the Frontend:**
   ```sh
   cd client && npm start
   ```
3. **Run Tests:**
   ```sh
   npm test
   ```

## 🚀 Deployment

Click the **Deploy to Render** button below:

Alternatively, deploy using Docker:

```sh
docker-compose up --build
```

## 🔒 Security Considerations

If handling Personally Identifiable Information (PII), ensure:

- 🚧 **Minimal Data Collection** – Only collect essential information.
- 🔐 **Restricted Access** – Data should be accessible only to authorised users.
- ✅ **Authentication** – Use GitHub authentication; avoid ad-hoc solutions.
- 📝 **Auditing** – Maintain logs to track data access.
- 🛡️ **Secure APIs** – Avoid relying on frontend security alone.
- 👨‍💻 **Code Reviews** – Senior developers must review before deployment.

## 🤝 Contribution Guide

We welcome contributions! Follow these steps:

1. Fork the repository
2. Clone it locally:
   ```sh
   git clone https://github.com/bkarimii/slack-dashboard.git
   ```
3. Create a new branch:
   ```sh
   git checkout -b feature-branch
   ```
4. Make your changes and commit:
   ```sh
   git commit -m "Add new feature"
   ```
5. Push to GitHub and open a Pull Request:
   ```sh
   git push origin feature-branch
   ```
   Great! Let's add the **Tech Lead** section to give it an extra touch of recognition. I'll continue with the same style to make it cohesive, but with a bit more emphasis on their leadership role.

---

## 🌟 **Our Amazing Contributors**

This project wouldn't be the same without the incredible contributions of our team. A huge thank you to each of you for your hard work and dedication!

### 👨‍💻 **Tech Lead**

#### 🥇[oliverlloyd](https://github.com/oliverlloyd)

<img src="https://github.com/oliverlloyd.png" width="50" style="border-radius: 50%; border: 3px solid #FFC107; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); margin-right: 20px;" align="left">

The guiding force behind the project, overseeing architecture, design, and decision-making. Leading by example, ensuring we stay on track with goals, and bringing out the best in the team.

---

### 💻 **Backend Developer**

#### 💻 **[bkarimii](https://github.com/bkarimii)**

<img src="https://github.com/bkarimii.png" width="50" style="border-radius: 50%; border: 3px solid #4CAF50; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); margin-right: 20px;" align="left">

The backbone of the project! With expertise in server-side development, ensuring smooth data handling and architecture. Your work powers everything behind the scenes.

---

### 🎨 **Frontend Developers**

#### 🚀 **[ebrahimbeiati](https://github.com/ebrahimbeiati)**

<img src="https://github.com/ebrahimbeiati.png" width="50" style="border-radius: 50%; border: 3px solid #2196F3; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); margin-right: 20px;" align="left">  
Creating pixel-perfect designs with a touch of elegance. Always pushing the limits of what's possible in user interaction and experience.

#### 🌟 **[jordan-choi](https://github.com/jordan-choi)**

<img src="https://github.com/jordan-choi.png" width="50" style="border-radius: 50%; border: 3px solid #2196F3; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); margin-right: 20px;" align="left">  
Making web interfaces feel alive! A creative force behind beautiful and functional designs that are both intuitive and stunning.

---

### 🔥 **A Team of Passionate Developers**

These contributors have made this project what it is today, each bringing their unique skills and talents. If you’re interested in their work, feel free to visit their profiles, check out their repositories, and connect with them!

---

**New Highlights:**

- **Tech Lead**: The tech lead is emphasized with a gold border to distinguish their leadership role, symbolizing guidance and oversight.
- The **descriptions** highlight the responsibility of leadership, making it clear how crucial the Tech Lead's contributions are to the project's success.

This format keeps the style consistent while elevating the Tech Lead’s role. It’s clean, creative, and reflects the contributions of each team member in a clear, engaging way!

## 📜 License

This project is licensed under the **MIT License**.

## 📞 Contact

For support, check the [wiki](https://github.com/bkarimii/slack-dashboard/wiki) or join `#cyf-full-stack-starter-kit` on [Slack](https://codeyourfuture.slack.com/archives/C021ATWS9A5).

# Starter Kit v2

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

- [x] [Node] LTS support (verified working on 20.x LTS release)
- [x] [Express] server
- [x] [Postgres] database with [`pg`][node-postgres]
- [x] Logging with [Winston] and [Morgan]
- [x] [React] client with [Vite]
- [x] Client-side routing with [React Router]
- [x] Linting with [ESLint] and [Prettier]
- [x] Unit and integration testing with [Vitest] and [Jest] (with [SuperTest] and [TestContainers])
- [x] E2E testing with [Playwright]
- [x] Dev mode (watch modes for client and server, proxy to avoid CORS issues)
- [x] Production build (single deployment artifact)
- [x] [GitHub Actions] pipeline
- [x] [Google App Engine], [Heroku], [Render] or [Vercel] deployment
- [x] [Docker] build

## Setup

> **Note** if you have _any problems_ setting up the starter kit, see the [wiki] and, if still not solved, post to
> [`#cyf-full-stack-starter-kit` in Slack][2].

Pick one member of the team to own the repository and pipeline. That person should do the following:

1.  Click the "Use this template" button above (see [GitHub's docs][1]) to create your team repository and name it something appropriate for your project.
    - Your repo should say _"generated from"_, **not** _"forked from"_, _"CodeYourFuture/cyf-final-project-starter-kit"_ at the top
2.  In your repo, click the "Deploy to Render" button at the top of the README and log in using GitHub when prompted.
3.  Fill in a service group name for your application and then click "Apply".
4.  Once it has deployed successfully, click the "managed resources" link to view the application details.

Whenever you commit to main (or e.g. merge a [pull request]) it will get automatically deployed!

You should now make sure all of the project team are [collaborators] on the repository.

## Scripts

Various scripts are provided in the package file, but many are helpers for other scripts; here are the ones you'll
commonly use:

- `dev`: starts the frontend and backend in dev mode, with file watching (note that the backend runs on port 3100, and the frontend is proxied to it).
- `e2e`: builds and starts the app in production mode and runs the Playwright tests against it.
  - `e2e:dev`: builds and starts the app in dev mode and runs the Playwright tests against it.
- `lint`: runs ESLint and Prettier against all the relevant files in the project.
- `serve`: builds and starts the app in production mode locally.
- `ship`: runs `lint`, then `test`, then `e2e`; ideal before a `git push`.
- `test`: runs the unit and integration tests.
  - `test:cover`: runs the tests and outputs coverage data.

### Security

If the project handles **any kind of** Personally Identifiable Information (PII) then make sure the following
principles are followed:

- Only collect **strictly necessary** PII;
- Access to PII should be as restricted as possible;
- Access to PII should only be possible after authentication. Authentication **must be done** via GitHub. **Ad hoc
  authentication solutions are not allowed**;
- Admins must be able to control who has access to the platform and at which levels using only GitHub groups;
- There must be an audit mechanism in place. It is required by law to know who accessed what and when;
- Code must be reviewed by senior developers before being pushed to production;
- APIs must be secure. Make sure we are not handling security on the frontend.

[1]: https://docs.github.com/en/free-pro-team@latest/github/creating-cloning-and-archiving-repositories/creating-a-repository-from-a-template#creating-a-repository-from-a-template
[2]: https://codeyourfuture.slack.com/archives/C021ATWS9A5
[collaborators]: https://help.github.com/en/articles/inviting-collaborators-to-a-personal-repository
[Docker]: https://www.docker.com
[ESLint]: https://eslint.org/
[Express]: https://expressjs.com/
[GitHub Actions]: https://github.com/features/actions
[Google App Engine]: https://cloud.google.com/appengine/?hl=en
[Heroku]: https://www.heroku.com/
[Jest]: https://jestjs.io/
[Morgan]: https://github.com/expressjs/morgan
[Node]: https://nodejs.org/en/
[node-postgres]: https://node-postgres.com/
[node-test]: https://nodejs.org/api/test.html
[Playwright]: https://playwright.dev/
[Postgres]: https://www.postgresql.org/
[Prettier]: https://prettier.io/
[pull request]: https://help.github.com/en/articles/about-pull-requests
[React]: https://reactjs.org/
[React Router]: https://reactrouter.com/en/main
[Render]: https://render.com/
[SuperTest]: https://github.com/visionmedia/supertest
[TestContainers]: https://testcontainers.com/
[Vercel]: https://vercel.com/
[Vite]: https://vitejs.dev/
[Vitest]: https://vitest.dev/
[wiki]: https://github.com/textbook/starter-kit/wiki
[Winston]: https://github.com/winstonjs/winston
