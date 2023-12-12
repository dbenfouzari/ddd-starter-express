# DDD Starter Express

This starter contains a working DDD implementation of an API with Swagger, SonarCloud, Dependency Injection system, and much more.

## Table of Contents
- [How to start](#how-to-start)
- [Details](#details)
  - [TypeScript config](#typescript-config)
  - [Sonar](#sonar)
  - [Environment variables](#environment-variables)
  - [Swagger](#swagger)

---

## How to start
Let's take an example. Imagine you want to create a `Post` module.
You may want to get a list of posts for a user. So you will create a `GetUserPosts` use case.
You will have to create a folder `src/post` with the following folder structure:
>- `src/post`
>  - `application`
>    - `services`
>      - `IPostReadRepository.ts`
>    - `use-cases`
>      - `IGetUserPosts.ts`
>  - `di`
>    - `tokens.ts`
>    - `PostDependencyRegistrar.ts`
>  - `domain`
>    - `entities`
>      - `Post.ts`
>    - `value-objects`
>      - `PostId.ts`
>      - `PostTitle.ts`
>      - `PostContent.ts`
>  - `infrastructure`
>    - `services`
>      - `PostReadRepository.ts`
>    - `use-cases`
>      - `GetUserPosts.ts`
>    - `http`
>      - `routes`
>        - `index.ts`
>        - `GetPostRoutes.ts`

This may look a lot of files but every layer has its own responsibility.

- `application` layer is responsible for the business logic. It contains the use cases and the services.
It only contains interfaces, no implementation.
- `di` layer is responsible for the dependency injection. It contains the tokens and the dependency registrar.
- `domain` layer is responsible for the domain logic. It contains the entities and the value objects.
- `infrastructure` layer is responsible for the infrastructure logic. It contains the services and the use cases, as well as the routes.

Let's imagine you want to make your service available as a command-line.
You will have to create a `src/post/infrastructure/cli` folder with the necessary interface
between the CLI and the `application` layer.
All the rest remains the same since the `infrastructure` layer is responsible for the infrastructure logic.

## Details

### TypeScript config
We have set up some aliases with TypeScript. Each time you create a "module", you may want to setup its alias in `compilerOptions.paths`.
For example, let's say you want to create a `Auth` module, you will create a folder in `src/auth` and complete `compilerOptions.paths` with
`"@auth/*": ["./src/auth/*"]`.

Jest will automatically be set up to know those aliases and run correctly.

### Sonar
We've decided to use Sonar to get code quality metrics.
You must complete the `sonar-project.properties` file in order to make it work. Or just remove it if you don't want to use `Sonar`.

### Environment variables
We've set up JWT authentication. In order to use it securely, you should update environment variables with secrets.
You can generate random secrets with
```sh
openssl rand -base64 24
```

### Swagger
We use `swagger-ui-express` with `swagger-jsdoc` to generate a Swagger documentation.
You can see it when server is started, by going to [`http://localhost:4000/api/v1/api-docs`](http://localhost:4000/api/v1/api-docs) (if port is default).
```sh
pnpm run start:dev
```
