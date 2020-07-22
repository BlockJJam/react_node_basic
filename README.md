# react_node_basic

- 프로젝트 기능 설명
기본적인 회원가입, 로그인, 인증기능을 Node.js 와 React.js를 통해 블루프린트로 만들어놓는다.
회원가입 후에 해당 유저에게 웹토큰을 통해 로그인 상태를 유지하고 로그인한 유저는 로그인과 회원가입 페이지는 들어갈 수 없다.
이러한 기능 구현은 inflearn의 John Ahn 강사님의 강의를 통해 실습했다.

- 프로젝트 설치

구현 OS : Linux(Ubuntu16.04), yarn 꼭 설치!

프로젝트 다운로드
```
git clone 상위 code(화살표)
```

프로젝트 라이브러리 설치
client에서
```
yarn -g add create-react-app
create-react-app .
```
server에서
```
npm i 
```

- 웹 구동

client dir에서 다음 명령어 실행
```
npm run dev
```
