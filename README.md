# Convey Your Mind FE

- IDE: vscode
- language: typescript
- linter: eslint
- code formatter: prettier
- style sheet: scss
- node modules: yarn berry으로 관리

_참고)_  
node 버전이 16.4.2 이하면 `yarn test`가 동작하지 않을 수 있다.  
windows에서 git bash를 쓰면 next errno -4094를 마주할 수 있다. 권한 관련 문제라는데 그냥 cmd 쓰면 된다.

## git clone

~프로젝트 시작 경로에 한글이 있으면 `react-script`가 실행이 안 된다(수정하지 않는 모양이다).~  
안전하게 영어 경로만 있는 곳에서 시작하길 추천한다.

## (vscode) yarn berry guide

1. `npm i -g yarn`

yarn classic이 설치된다.
현재(23.05) 기준으로 최신 yarn classic은 1.22.11이다.

2. `yarn set version berry`

version 뒤에 사용할 yarn version을 명시하는 것인데, berry를 쓰겠다는 뜻이다.  
certificate 문제로 실패한다면 strict-ssl을 false로 설정한다.

3. vscode 실행 환경 설정

1\) vscode extension으로 ZipFS를 설치한다.

![ZipFS extension](https://user-images.githubusercontent.com/63287638/235682764-62c14c8f-9388-4e45-b849-f7a615a5fc7a.jpg)

2\) `yarn dlx @yarnpkg/sdks vscode`로 vscode 관련 세팅을 설치한다.
3\) vscode가 typescript 프로젝트를 잘 이해할 수 있도록 한다. 오른쪽 아래에 자동으로 버튼이 생성되지 않는다면 아무 typescript 파일에 들어간 다음 ctrl + shift + p를 눌러 typescript를 검색한 다음, "Use Workspace Version"을 클릭한다.
4\) 그래도 파일을 찾지 못한다면 `yarn` 명령어를 다시 입력한다.

## (vscode) prettier, eslint guide

1. vscode extension을 설치한다.

![eslint extension](https://user-images.githubusercontent.com/63287638/235683029-004df456-cb9d-4976-814d-35e1dea6735b.jpg)

![prettier extension](https://user-images.githubusercontent.com/63287638/235683037-07fbfbeb-f602-42a9-ada9-30759dd43183.jpg)

2. ctrl + shift + p를 눌러 "Preferences: Open User Settings(UI)"를 선택한 뒤, "format" 검색한다.
3. default formatter, foramt on save 두 가지 옵션을 아래 사진과 같이 변경한다.

![settings format](https://user-images.githubusercontent.com/63287638/235683944-b374be2c-0431-4cd2-ba44-ea900bd21a23.jpg)

## husky

1. `yarn prepare`
2. 실행할 수 있도록 권한 변경

- (mac or linux) `chmod 7xx ./.husky/*`
