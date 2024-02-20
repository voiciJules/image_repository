##### 2024-02-19

creation of project folder(`image_repository`)
=> creation of `server` folder
=> `cd server`
=> `npm init -y`
=> `npm i express`
=> `npm i -D(dev) nodemon` library for helping coding efficiency. we don't need to turn on and off all the time for renewing the page.
=> make `server.js` in server folder
=> add "dev": "nodemon server.js" in scripts of package.json and change to "main": "server.js"
=> console.log('hello world!') using `npm run dev`
=> make basic backend

```
const express = require("express");
const app = express();
const port = 5000;

app.get("/", (req, res) => {
  res.json("Hi this is image repo!!");
});

app.listen(port, () => console.log(`app listening on port ${port}`));
```

=> `npm run dev` and `localhost:5000` to check if server.js works
=> make `app.post` and check with Postman using post(http://localhost:5000/upload) with res.json('post!')

=> `npm i multer --save` : image upload middleware

- Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files.
- reference : https://github.com/expressjs/multer/blob/master/doc/README-ko.md
- https://inpa.tistory.com/entry/EXPRESS-%F0%9F%93%9A-multer-%EB%AF%B8%EB%93%A4%EC%9B%A8%EC%96%B4
- 아래의 코드를 통해 multer를 이미지를 업로드 할 수 있다. multer는 미들웨어로서 upload.single 부분을 통해 하나의 파일을 업로드 할 수 있도록 되어 있는데, single 이 아닌 다른 함수를 넣음으로써 여러가지 파일을 업로드 할 수도 있다. upload.single 부분이 미들웨어 부분인데, 인증이나 로그 등의 미들웨어를 추가한다고 했을 때, upload, auth, log 등으로 더 많은 미들웨어를 집어 넣을 수 있다. dest는 들어오는 파일이 저장될 장소인데, dest 부분을 작성하고 저장하면 자동으로 uploads 폴더가 server 폴더 하위에 생성된다. 아래 코드를 포스트맨(post, body => form-data) 을 통해 실행시 파일에 대한 정보를 얻을수 있다. uploads에 저장된 이미지는 vs code 내에서 바로 볼 수 없는데, 이름에 해당되는 확장자를 붙이면 이미지를 화면에서 볼 수 있다.

```
const multer = require("multer");
const upload = multer({ dest: "uploads" });

app.post("/upload", upload.single("image"), (req, res) => {
  console.log(req.file);
  res.json(req.file);
});
```

위 코드를 아래와 같이 바꿔서 파일의 저장과정을 우리가 제어할 수 있도록 할 수 있는데, 자동적으로 /uploads 폴더가 생성되지 않으므로 해당 폴더를 만들어주어야 에러가 나지 않는다. cb는 콜백의 약자로, 만약 파일 저장을 차단하고 오류처리를 하고 싶은 경우가 있다면 cb의 첫번째 인자에 오류 객체를 입력해주면 되는데 현재는 검증을 적용하지 않았기 때문에 null을 이용했고 따라서 이 경우에는 성공처리가 된다. 두번째 인자는 destination 이고 파일네임과 리미트 인자를 통해 파일의 크기와 이름을 지정할 수 있다.

```
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});
```

=> `npm i uuid mime-types`

- 이미지가 들어올 때 같은 이름인 경우에는 덮어쓰기가 되거나 하면서 문제가 발생할 수 있기 때문에 고유의 이름을 생성해주는 것이 좋으므로 "고유 id + 파일타입"을 정해서 이름을 넣어주었다.
- uuid reference : https://velog.io/@bbaekddo/nodejs-1
  https://www.npmjs.com/package/uuid
- mime-types reference : https://www.npmjs.com/package/mime-types
  에러의 여지가 있어서 mime-types 라이브러리를 사용하는 편이 낫다.
  https://dev.to/victrexx2002/how-to-get-the-mime-type-of-a-file-in-nodejs-p6c#:~:text=The%20mime%20package&text=After%20installation%2C%20you%20can%20use,or%20extension%20as%20an%20argument.

```
const { v4: uuid } = require("uuid");
const mime = require("mime-types");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    console.log("file", file);
    console.log(mime.lookup(file.originalname));
    cb(null, `${uuid()}.${mime.extension(file.mimetype)}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});
```

lookup과 extension은 아래와 같은 값을 출력한다.
mime.lookup(file.originalname) => image/jpeg
mime.extension(file.mimetype) => jpeg

=> express에서 정적 파일 제공(이미지 외부로 노출시키기),
첫번째 인자: 주소창에서 정적파일을 제공할 주소, 두번째 인자: 정적파일을 포함하는 폴더
`app.use("/address", express.static("public"));`

- https://expressjs.com/ko/starter/static-files.html
  => www.localhost:5000/uploads/filename` 실행해서 확인하기
