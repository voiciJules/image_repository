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

=> multer fileFilter 사용해서 이미지 파일 아닌 것은 업로드 할 수 없도록 하기

```
fileFilter: (req, file, cb) => {
    if (["image/jpeg", "image/png"].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("It's not an image file"), false);
    }
  },
```

##### 2024-02-20

=> Through create-react-app, create react procject.

- `npx create-react-app client` in image_repo folder
- `npm run start`

=> Form component creation

- make a folder named 'components' in the src folder. make a file named 'UploadForm.js'
  => Through useState, controle image file data
- By using 'input','label','button','form' tags, make a form. when you enter a file by input tag, you have to save the file into [file, setFile] using useState. when you click the button, onSubmit function executes. In this function(onSubmit), you have to use formData. make a new FormData() and append the file from the input tag with key 'image'. Make a try catch phrase and by using axios, you can post the file into the backend using '/upload'. you have to sync the address. Now, the client uses localhost:3000 and server uses localhost:5000. In the client's package.json, you can write "proxy":"http://localhost:5000' and shut down and power on the client and the server once to apply the package.json newly. Now. everything should work in normal.
- FormData reference : https://inpa.tistory.com/entry/JS-%F0%9F%93%9A-FormData-%EC%A0%95%EB%A6%AC-fetch-api
- 자바스크립트에서 FormData 객체란 단순한 객체가 아니며 XMLHttpRequest 전송을 위하여 설계된 특수한 객체 형태이기 때문이다. 그래서 간단하게 문자열 화할 수 없어, console.log를 사용하여 확인이 불가능하다. 하지만 formdata는 이터러블하기 때문에 아래와 같은 방법으로 확인할 수 있다.

```
// 폼 객체 key 값을 순회.
let keys = formData.keys();
for (const pair of keys) {
    console.log(pair);
}

// 폼 객체 values 값을 순회.
let values = formData.values();
for (const pair of values) {
    console.log(pair);
}

// 폼 객체 key 와 value 값을 순회.
let entries = formData.entries();
for (const pair of entries) {
    console.log(pair[0]+ ', ' + pair[1]);
}
```

- onSubmit 과 같이 무언가를 제출하는 함수의 경우에는 페이지가 다시 모든 정보를 리로드 하지 않도록 e.preventDefault() 명령어를 사용한다.
- axios.post 사용법
  https://sumni.tistory.com/152

=> Upload images by drag and drop

- css 의 position 속성(relative, absolute)
- reference : https://www.daleseo.com/css-position/
- 부모 position을 relative 로 설정하고 자식을 absolute로 설정하여 두개가 겹치게 만들 수 있다. cursor 와 hover 등의 요소를 넣어주었고, display: flex 로 지정하여 justify-content, align-items 등을 사용해서 텍스트가 중간에 오게 만들 수 있었다. 개발자 도구로 element 지정하여 input 박스가 전체박스를 차지하도록 한다(position: absolute).

=> Use 'react-toastify'
`npm i react-toastify`
다른 곳에서도 사용 가능하므로 상위단(App.js)에서 선언할 것
https://www.npmjs.com/package/react-toastify

가장 상위단인 App.js 에 아래와 같이 import 및 선언해줌

```
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div>
      <ToastContainer />
      <h2>image repository</h2>
      <UploadForm />
    </div>
  );
}
```

- 실제 사용하는 UploadForm.js 에서 alert 대신 사용하면 된다.

```
import {toast} from 'react-toastify';

toast.success('success!')
toast.error('fail!')
```

##### 2024-02-21

=> Create 'Progress Bar' to show the uploading status

- Implemented by using `onUploadProgress`
- https://sangcho.tistory.com/entry/axios
- https://velog.io/@boyeon_jeong/Axios-Axios%EC%9D%98-%EB%8B%A4%EC%96%91%ED%95%9C-%EA%B8%B0%EB%8A%A5-%EC%82%B4%ED%8E%B4%EB%B3%B4%EA%B8%B0
- Make a 'ProgressBar.js' and 'ProgressBar.css'. As a prob, ProgressBar receives 'percent' to show the progress bar using 2 'div's. To make it smooth, I used 'transition:0.3s'. 3 seconds after upload, through setPercent and setFileName, return percent and fileName to their initial values.

=> Make preview function for the image uploading

- by setting a condition for CSS, when choosing a file from input, it shows the preview image below the title 'image repository'. it's in the form tag. and I used FileReader in the imageSelectHandler because, when I choose some image by clicking the input tag, it shows the preview image by using FileReader.
- https://developer-talk.tistory.com/331
- https://taedonn.tistory.com/31
- input attribute accept="image/\*" 를 통해서 type='file' 처럼 모든 파일을 받는 것이 아니라 이미지만을 받아들일 수 있다.

```
const fileReader = new FileReader();
    fileReader.readAsDataURL(imageFile);
    fileReader.onload = (e) => {
      // setImgSrc(fileReader.result);
      setImgSrc(e.target.result);
    };
```

- 위 코드에서 imageFile 대신 file을 넣으면 "Failed to execute 'readAsDataURL' on 'FileReader': parameter 1 is not of type 'Blob'." 와 같은 오류가 난다. imageFile 과 file을 번갈아 넣어가면서 리액트 개발자 도구 컴포넌트 란의 hooks 부분을 비교해보니 imageFile 로 했을 때는 imgSrc 가 제대로 생성되었지만 file 로 했을 때는 생성되지 않고 오류가 났다. 어떤 사진은 둘다 되기도 했는데, 아마도 용량이 약간 더 큰 것들은 file 로 imageFile이 넘어가기 이전에 setImgSrc가 진행되므로 file이 null 인 상태로 넘어가는 것 같다. 정말로 이미지 파일이 있는 것인지 if 문을 통해 확인하는 것도 좋은 방법이라고 생각한다.
