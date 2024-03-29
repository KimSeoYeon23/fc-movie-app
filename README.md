# Movie App (TypeScript ver.)

OMDb API를 활용해 VanillaJS 영화 검색 사이트를 제작했습니다.
이 프로젝트는 [JS 버전](https://github.com/KimSeoYeon23/fc-movie-app/tree/js-only)과 [TS 버전](https://github.com/KimSeoYeon23/fc-movie-app/tree/typescript)으로 나누어져 있습니다.

[DEMO](https://fc-movie-app.vercel.app/)

![Screenshot](./img/OMDB_API_main.png)

### 프로젝트 시작하기

```bash
$ npm i
$ npm run vercel
```

### Reset.css

브라우저의 기본 스타일을 초기화한다.

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reset-css@5.0.1/reset.min.css" />
```

### Google Fonts

[Oswald](https://fonts.google.com/specimen/Oswald?query=oswa), [Roboto](https://fonts.google.com/specimen/Roboto?query=robo) 폰트를 사용한다.

```html
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@500&family=Roboto:wght@400;700&display=swap" rel="stylesheet" />
```

## Vercel Hosting

`node-fetch` 패키지는 꼭 2버전으로 설치해야 한다.
3버전은 node.js의 common.js 모듈 방식과는 맞지 않는다.

```bash
$ npm i -D vercel dotenv
$ npm i node-fetch@2
```

__/vercel.json__

```json
{
  "devCommand": "npm run dev",
  "buildCommand": "npm run build"
}
```

__/package.json__

```json
{
  "scripts": {
    "vercel": "vercel dev"
  }
}
```

### Vercel 개발 서버 실행

Vercel 구성 이후에는 `npm run dev`가 아닌 `npm run vercel`로 개발 서버를 실행해야 한다.

```bash
$ npm run vercel
```

## Vercel Serverless Functions

프로젝트 루트 경로에 `/api` 폴더를 생성하고,   
API Key 를 노출하지 않도록 서버리스 함수를 작성합니다.

__/api/movie.js__

```js
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import {VercelRequest, VercelResponse} from '@vercel/node';

dotenv.config();

export default async function handler(request: VercelRequest, response: VercelResponse) {
  const { title, page, id } = JSON.parse(request.body as string);
  const url =  id 
        ? `https://www.omdbapi.com/?apikey=${process.env.OMDb_API_KEY}&i=${id}&plot=full` 
        : `https://www.omdbapi.com/?apikey=${process.env.OMDb_API_KEY}&s=${title}&page=${page}`;
  const res = await fetch(url);
  const json = await res.json();
  response.status(200).json(json)
}
```

### 환경변수

로컬의 개발용 서버에서 사용할 환경변수를 `.env` 파일에 지정합니다.

__.env__

```dotenv
OMDb_API_KEY=<MY_OMDb_API_KEY>
```

제품 서버(Vercel 서비스)에서 사용할 환경변수를 지정합니다.  
Vercel 서비스의 프로젝트 __'Settings / Environment Variables'__ 옵션에서 다음과 같이 환경변수를 지정합니다.

![Vercel .env Setting](./img/vercel_env_setting.png)

### TypeScript

타입스크립트 코어 패키지와 `node-fetch`의 타이핑 패키지를 설치한다.

```bash
npm i -D typescript @types/node-fetch@2
```

__/tsconfig.json__
```json
{
  "compilerOptions": {
    "target": "ES2015",
    "module": "ESNext",
    "lib": ["ESNext", "DOM"],
    "strict": true,
    "moduleResolution": "node",
    "esModuleInterop": true
  },
  "include": [
    "src/**/*.ts",
    "src/**/*.d.ts",
    "api/**/*.ts"
  ]
}
```