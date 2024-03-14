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

##### 2024-02-21 데이터베이스 연동해서 이미지 관리하기

=> mongoDB atlas 설정 및 Node.js로 연결하기
username : voicihojun / password : JZOkSmwQ8atwW3pz
`npm i mongoose`
mongoose reference : https://www.npmjs.com/package/mongoose
MongoDB에 로그인해서 connect 메뉴를 통해 app에 연결할 수 있는 코드를 제공받을 수 있다.
mongoDB 가 연결된 후에 서버가 연결되도록 한다.

=> dotenv 사용
`npm i dotenv`
https://www.npmjs.com/package/dotenv
코드의 제일 상단에 `require("dotenv").config();` 선언 후, .env 파일 만들어서 변수 생성한다. 그 후 process.env.variableName 으로 접근하여 사용가능하다. .gitignore 를 만들어서 그 안에 .env 파일을 포함시킨다. 암호를 외부에 노출 할 수 있기 때문임.

=> Database에 사진정보 저장하기
mongoose 이용해서 이미지 mongoDB 에 저장하기
https://velog.io/@str2023/%EB%AA%BD%EA%B3%A0DB%EC%97%90-%EC%9D%B4%EB%AF%B8%EC%A7%80-%EC%A0%80%EC%9E%A5%ED%95%98%EA%B8%B0-mongoDB-nodeJS-express-mongoose
이미지 파일 저장을 위한 몽고DB 스키마(key, originalFileName을 포함)를 작성하고 모델을 만든다. 다음에 server.js의 app.post의 이미지 업로드 API 작성된 부분의 upload.single('image') 부분에서 Image 모델을 불러와 req.file의 filename 을 key에 originalname을 originalFileName 에 할당하고 Image.save()를 통해 데이터베이스에 저장한다.

=> 사진정보 데이터베이스에서 불러오기
server.js 의 app.get('/images)에서 Image.find() 함수를 이용하여 Image에 저장된 모든 이미지들을 불러온다. app.post('/upload', ...) 를 app.post('/images', ...)로 바꾸어 줌. images 에 post/get 하는 것이 더 통일성이 있다. UploadForm.js의 app.post 부분의 ('/upload') 부분도 ('/images')로 바꾸어준다.

##### 2024-02-22 Make an Image List

=> Fetch image datas by useEffect

- Make an ImageList.js file as a component. In this file, fetch images and set them in 'images' variable by using useEffect and axios.get('/images').then(). After getting the images using axios, show them using 'images.map'. img src should use `http://localhost:5000/uploads/${image.key}`. in this source, we use files in the local 'uploads' folder. By app.use('uploads', express.static("public")), we could see each image in the browser before.

=> Show right away in imgList after uploading a new image

- data always flow from parent to children. In the ImageList.js file, I brought useState(images files) and useEffect to App.js. Through props, I could send the 'images' and 'setImages' to ImageList.js and UploadForm.js. In the UploadForm.js file's onSubmit function, by using setImages([...images, newly added image]), we can show the new image right away.

=> Use Context API to manage image datas

```
export const ImageContext = createContext();

export const ImageProvider = (prop) => {
  const [images, setImages] = useState([]);
  useEffect(() => {
    axios
      .get("/images")
      .then((result) => setImages(result.data))
      .catch((err) => console.error(err));
  }, []);
  return (
    <ImageContext.Provider value={[images, setImages]}>
      {prop.children}
    </ImageContext.Provider>
  );
};
```

context 폴더에 ImageContext.js 파일을 만든 후 위와 같은 코드를 작성. createContext() 로 컨텍스트를 생성한 후, ImageProvider 컴포넌트를 통해 value 값을 그 하위 모든 자식들에게 사용 가능하도록 하는 것이다. export 를 꼭 추가해야 한다. 그리고 최상위인 index.js 로 가서 ImageProvider 를 import 하여 <App />을 감싸주면 된다. 하위 파일들에서 사용시 useContext(ImageContext)를 통해 value 값을 불러와서 사용하면 되는데, 여기서는 useEffect axios.get으로 불러온 images 배열을 불러와서 모든 파일에서 사용하도록 하였다. 이렇게 함으로써, 부모에서 자식, 자식의 자식 이런 식으로 끝없이 넘겨줘야 하는 props 문제를 해결 할 수 있다. UploadForm.js 와 ImageList.js 의 images, setImages props는 더 이상 필요없게 되었고, useContext를 사용하여 value 값을 불러와 사용할 수 있게 되었다. prop과 prop.children 사용시 중괄호 사용에 주의 할 것.

##### 2024-03-01 Authentication(diagram 1, 2)

=> 리팩토링
PORT 변수를 .env 부분으로 빼주었음.
server.js 의 '/images' 부분은 routes 폴더를 생성해서 imageRouter.js 파일에 넣어주었음. 그에 관한 코드들(import, module.export 등)을 옮겨줌.
multer 사용부분은 middleware 폴더의 ImageUpload.js 로 뽑아내고 그에 관한 코드들을 옮겨줌.
server.js 에서 app.use("/images", imageRouter); 로 imageRouter를 사용할 수 있도록 해준다.

=> 회원가입 API 만들기(diagram 3)
routes 폴더에 userRouter.js 를 만든 후, userRouter.post('register', ...) 코드를 생성 한 후 req.body 가 이상없이 나오는지 확인한다. 값이 undefined로 나오는데 그건 json 을 파싱해서 보내주지 않기 때문이므로 `app.use(express.json())`를 server.js 에 넣어서 파싱한 값이 이상없이 출력되는지 확인하다.
server.js 에서 'app.post('/users', userRouter) 코드를 넣어주고 해당되는 임포트 코드들을 넣어준다. models/User.js를 만들어서 username, name, password를 포함하는 User를 만들고 userRouter에서 받아온 req.body를 User 모델을 사용해서 저장하여준다. MongoDB에 가서 이상없이 생성되었는지 확인하면 끝.
비밀번호를 이런 식으로 저장하는 것은 보안에 매우 취약.

=> 비밀번호 암호화 원리

회원가입시 ID 는 데이터베이스에 그대로 저장하고, 패스워드는 해쉬와 salt 를 사용해서 암호화 된 형태로 데이터베이스에 저장한다. 이 암호화 된 패스워드를 패스워드 B 라고 하자. 로그인시 암호를 확인하는 방식은, 로그인하는 사람이 ID 와 패스워드를 넣으면, ID를 가지고 패스워드 B를 조회한다. 패스워드 B 로부터 salt 정보를 알아내서 그 salt 정보를 가지고 로그인하는 사람의 패스워드를 해쉬하여 패스워드 A를 만들고, 패스워드 A 와 패스워드 B 를 비교해서 두 개가 일치하면 로그인이 성공하게 되는 것이다.

=> 회원가입 API 마무리하기
Bcryptjs 설치 `npm i bcryptjs`
`https://www.npmjs.com/package/bcryptjs`

```
const { hash } = require("bcryptjs");
const hashedPassword = await hash(req.body.password, 10);
// password, salt 를 넣어주어 hashed password 를 만들어준다.
```

username < 3 과 password < 6, 길이가 너무 짧으면 에러를 발생하도록 하였다.

=> 로그인 API 만들기(diagram 4)

```
userRouter.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    const isValid = await compare(req.body.password, user.hashedPassword);
    if (!isValid) throw new Error("invalid information!");
    res.json({ message: "user validated!" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
```

username 을 통해서 유저의 정보를 불러온 후에 bcryptjs의 compare 기능을 이용해서 두 패스워드를 비교하여, 일치하지 않으면 에러메세지를 내보내고 일치하면 user validated 메세지를 내보낸다.

=> 세션 만들기

```
user.sessions.push({ createdAt: new Date() });
const session = user.sessions[user.sessions.length - 1];
await user.save();
res.json({
  message: "user validated!",
  sessionId: session._id,
  name: user.name,
});
```

모델 폴더의 User.js 에 sessions 부분을 추가한다. `sessions: [{createdAt: { type: Date, required: true }}]`
userRouter.post('/login') 에서 compare를 통해 비밀번호까지 이상없으면, user.sessions.push를 통해 createdAt: new Date()를 하고 저장한다. 제일 마지막 세션이 유효한 세션. res.json을 통해 화면에 생성된 session 과 name 을 확인하다.
userRouter.post('register') 부분도 마찬가지로 새로운 user 를 생성할 때, sessions를 넣고, res.json을 통해 새로 생성된 session 과 name 을 확인하다. 회원가입시에는 세션이 하나밖에 존재하지 않으므로 user.sessions[0] 으로 세션을 찾으면 된다.

=> 로그아웃 API 만들기
userRouter.patch('/logout', ...) patch로 함. 왜냐하면 sessions 정보만 수정해주기 때문이다.
로그아웃시에는 일단 로그인된 유저임을 확인해야 하므로 일단 req.headers 에 있는 세션정보를 가져와서 User.findOne을 통해서 user 를 찾아와서 User.updateOne을 통해서 user.id 로 유저를 탐색하고, $pull 을 session을 지워준다. 여기서, 헤더에 sessionid 가 일치하지 않는 것을 넣을 경우 "message": "Cast to ObjectId failed for value" 에러가 발생하는데 데이터베이스에 해당 sessionid 를 보내기 전에 mongoose.isValidObjectId 를 통해 데이터베이스에 보내기전에 유효성 검사를 하여 데이터베이스에 부과를 줄일 수 있다.

=> 인증 미들웨어 만들기
middleware/authentication.js 를 생성하고 userRouter.js 의 로그아웃시 세션정보를 통해서 유저를 가져와서 req.user 에 user 를 넣어주어서 (req.user = user) 다른 파일들에서도 req.user 정보를 사용할 수 있는 미들웨어를 만든다.

```
const authenticate = async (req, res, next) => {
  const { sessionid } = req.headers;
  if (!sessionid || !mongoose.isValidObjectId(sessionid)) return next();
  const user = await User.findOne({ "sessions._id": sessionid });
  if (!user) return next();
  req.user = user;
  return next();
};
```

next() 전에 return 을 넣어주지 않으면 여러번 next() 가 호출 될 수 있는 상황이 오면서 에러(error-cant-set-headers-after-they-are-sent-to-the-client) 가 발생한다.

##### HTTP METHOD

GET : 리소스 조회
POST : 요청데이터를 처리, 주로 등록에 이용한다
PUT : 리소스를 대체, 해당 리소스가 없으면 생성한다
PATCH : 리소스 부분 변경
DELETE : 리소스 삭제

##### Section 6. React-Authentication

=> react-router-dom 적용하기
src 폴더 아래 pages 폴더생성하여 LoginPage, RegisterPage, MainPage를 만들고 MainPage 내에 UploadForm, ImageList를 위치시킨다. client 폴더에서 `npm i react-router-dom`. 이 페이지들을 App.js 에 다시 위치시킨다.
아래와 같이, path 속성과 element 속성을 가지고 Route 를 Routes 안에 작성 후, BrowserRouter를 최상위 index.js 로 가서 다른 컴포넌트들을 감쌀 수 있도록 작성한다.

```
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div style={{ maxWidth: "500px", margin: "0 auto" }}>
      <ToastContainer />
      <Routes>
        <Route path="/auth/register" exact element={<RegisterPage />} />
        <Route path="/auth/login" exact element={<LoginPage />} />
        <Route path="/" exact element={<MainPage />} />
      </Routes>
    </div>
  );
}
```

=> create toolbar
components 폴더에 ToolBar.js 만든다. <a> tag 사용시 전체 페이지가 다시 리로딩되므로 a tag 사용하면 안 됨. 그래서 Link (from react-router-dom)라는 라이브러리 사용하였고, 이상없이 자료 나오는 것 확인 후 Link 라는 react-router-dome 라이브러리의 함수 이용하여 해당 페이지로 각각 보내줌.

```
<Link to="/auth/register">
  <span style={{ float: "right", marginRight: 15 }}>Signup</span>
</Link>
```

=> 회원가입 폼 만들기
RegisterPage.js 에 form 태그를 만들어서 name, username, password, password check 에 관한 인풋을 만들어주는데, 중복되는 부분이므로 useState, props 를 사용해서 CustomInput.js 라는 콤포넌트를 만들었고, 이걸 사용해서 RegisterPage.js에 네가지 인풋을 넣는 것을 구현한다.

=> 회원가입 API 호출하기
[DOM] Input elements should have autocomplete attributes (suggested: "new-password"):
콘솔에 위와 같은 에러 나서 CustomInput.js 에 autocomplete='off' 로 넣어주니 에러 사라짐.

RegisterPage.js에서 submit button 만들고 submitHandler 함수 만들어줌. 조건식 username < 3, password < 6, password != passwordCheck 확인 먼저 넣어줘서 에러발생 만들어주고, 아래와 같이 axios 사용해서 name, username, password 전달해줌.

```
await axios.post("/users/register", {name, username, password,});
```

몽고디비에 가서 유저가 이상없이 저장되었는지 확인 및 toast 로 회원가입 성공 메세지 작성.

=> toolbar 에 로그인 유/무 표현하기

회원가입한 경우, 로그인 상태관리를 해줘야 하므로 client/src/context 폴더에 AuthContext.js 만든다. [me, setMe]를 통해서 상태관리를 해주고, AuthContext.Provider를 index.js에 위치시켜 어디서든지 useContext를 사용해서 로그인 상태관리를 사용할 수 있도록 한다. RegisterPage에서 setMe를 통해 userId, sessionId, name을 설정하고, ToolBar.js에서 me가 존재할 경우, 로그인, 회원가입이 나오도록 하고 그렇지 않을 경우에는 로그아웃 메뉴가 툴바에 나오도록 설정한다.

=> 로그아웃 처리하기
ToolBar.js에서 logout span tag를 클릭했을 때 로그아웃 처리가 되도록 logoutHandler 를 아래와 같이 만들어 주고 나서, 회원가입 후 로그아웃 클릭하면 네트워크 메뉴에서 'invalid sessionid' 에러 발생. userRouter.js 에서 에러가 발생했음을 알 수 있다.

```
onst logoutHandler = async () => {
    try {
      await axios.patch("/users/logout");
      toast.success("logged out! Toolbar.js");
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };
```

세션 아이디가 없기 때문에 에러가 발생하므로 세션아이디를 ToolBar.js 의 logoutHandler 에 넣어주면 되는데,, 그 내용은 아래와 같다.
axios 에서 첫번째 인자는 주소부분이고, 두번째는 바뀔 것, 세번 째는 config 임.

```
  const logoutHandler = async () => {
    try {
      await axios.patch(
        "/users/logout",
        {},
        { headers: { sessionid: me.sessionId } }
      );
      toast.success("logged out! Toolbar.js");
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };
```

매번 반복적으로 이 세션아이디를 설정해주는 것은 너무 귀찮은 일. context/AuthContext.js 에서 설정해주자.
디폴트로 authContext.js 에 useEffect를 써서 me 의 내용이 바뀔때마다 headers에 세션아이디를 넣어주는 기본 문구를 삽입한다.

```
export const AuthProvider = ({ children }) => {
  const [me, setMe] = useState(); // object

  useEffect(() => {
    if (me) axios.defaults.headers.common.sessionid = me.sessionId;
    // 세션 아이디를 me 를 셋업할 때 디폴트로 넣어주는 방법
    else delete axios.defaults.hearders.common.sessionid
    // me 가 없으면 그전에 혹시나 저장되어 있을 수 있는 세션 아이디를 지워라
  }, [me]);
  return (
    <AuthContext.Provider value={[me, setMe]}>{children}</AuthContext.Provider>
  );
};
```

=> 로그인 페이지 완성시키기
Register page 를 참고하여 만들면 된다. 다 완성 후 useNavigate from 'react-router-dom' 을 이용해서 '/' Home 화면으로 되돌아가도록 설정해준다.

=> 새로고침을 해도 로그인 유지시키기
localStorage 이용하여 sessionId 가 있을 경우, 로그인을 유지할 수 있도록 한다.
userRouter.js 에 아래와 같이 작성

```
userRouter.get("/me", (req, res) => {
  try {
    if (!req.user) throw new Error("권한이 없습니다. userRouter /me");
    res.json({
      message: "success",
      sessionId: req.headers.sessionid,
      name: req.user.name,
      userId: req.user._id,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});
```

AuthContext.js 의 useEffect 내에서 else if(sessionid) 조건문으로 sessionid 가 있을 경우에는 axios.get('/users/me')로 정보 가지고 와서 setMe로 me를 다시 설정해준다.

=> 오류 처리 개선하기
toast 로 나오는 확실하지 않은 정보들을 자세히 알려주기.
로그인 할 때, username 이 없거나 password 가 맞지 않을 때 나오는 toast 부분의 메세지가 정확하지 않으므로 err.response.data.message를 통해서 정확한 에러메세지를 사용자에게 보여줄 것. username이 없을 때의 오류처리를 해줄 것

##### Authorization & 사진첩 서비스 완성시키기

=> 섹션 소개
각 라우터에 필요한 기능들 todo 리스트 만들기

```
imageRouter.post("/", upload.single("image"), async (req, res) => {
  // 유저 정보, public 유무 확인, 이미지 모델 업데이트(user:{_id, username, name}, public)
})

imageRouter.get("/", async (req, res) => {
  // public 이미지들만 제공
})

imageRouter.delete("/:imageId", async (req, res) => {
  // 유저 권한 확인
  // 사진 삭제
  // 1. uploads 폴더에 있는 사진 데이터를 삭제
  // 2. 데이터베이스에 있는 image 문서를 삭제
})

imageRouter.patch("/:imageId/like", (req, res) => {
  // 유저 권한 확인
  // like 중복 안되도록 확인(한 사람이 한번만)
});

imageRouter.patch("/:imageId/unlike", (req, res) => {
  // 유저 권한 확인
  // like 중복 취소 안되도록 확인(한 사람이 한번만)
});
```

```
userRouter.get("/me/images", async (req, res) => {
  // 본인 사진들만 리턴(public === false)
```

=> 권한 확인 후 이미지 저장하기
Image model 수정하기 : public, user: {user.\_id, user.name, user.username, index:true} 이미지 모델에 추가하기
아래 부분 수정(imageRouter.js)
imageRouter.post("/", upload.single("image"), async (req, res) => {})

=> 공개/비공개 이미지 조회 API 만들기
아래 부분 수정해서 public일 때와 public이 아닐 때 구분해서 보여줌.

```
userRouter.get("/me/images")
```

```
imageRouter.get("/", async (req, res) => {
  // public 이미지들만 제공
  const images = await Image.find({ public: true });
  // Image.find({탐색},{수정},{옵션})
  res.json(images);
});
```

=> 이미지 삭제하기

```
imageRouter.delete("/:imageId", (req, res) => {
  // 유저 권한 확인
  // 사진 삭제
  // 1. uploads 폴더에 있는 사진 데이터를 삭제
  // 2. 데이터베이스에 있는 image 문서를 삭제
})
```

=> 좋아요 API 만들기
imageRouter.patch('/:imageId/like', async(req, res)=>{}) 부분 가서 살펴보기
imageRouter.patch('/:imageId/unlike', async(req, res)=>{}) 부분 가서 살펴보기
models/Image.js에서 likes: [] 추가하기.
imageRouter 에서 권한 확인하고, req.params.imageId 유효성 검사 후, Image를 찾아와서 likes 에 $addToSet 이용하여 중복 없이 유저 아이디 추가하기. unlike 시에는 중복 없이 $pull 사용해서 제거하면 됨.

```
imageRouter.patch("/:imageId/like", async (req, res) => {
  // 유저 권한 확인
  // like 중복 안되도록 확인(한 사람이 한번만)
  try {
    if (!req.user) throw new Error("권한이 없습니다. /:imageId/like");
    if (!mongoose.isValidObjectId(req.params.imageId))
      throw new Error("올바르지 않은 이미지 아이디 입니다. /:imageId/like");
    const image = await Image.findOneAndUpdate(
      { _id: req.params.imageId },
      { $addToSet: { likes: req.user.id } },
      { new: true }
    );
    res.json(image);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});
```

##### ===================== 여기까지 했음.

##### 섹션 8. React - Authorization & 사진첩 서비스 완성시키기

=> 이미지 생성 Form 수정하기
input checkbox 넣기
MainPage.js에서 로그인 했을 경우(me 가 있을 경우)에만 이미지 업로드 기능을 보여주기
