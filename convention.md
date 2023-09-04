# code convention guide

## typescript

1. 약어를 사용하지 않는다(ex. `i` or `idx` => `index`). 단, utility-first css의 클래스 이름은 예외로 한다(ex. `mt-8`).
2. 모든 컴포넌트 이름은 PascalCase를 사용하고 `const Component = () => {}`로 선언 및 모듈 export 한다. 단, 페이지 컴포넌트는 `not-found.tsx`, `page.tsx`의 네이밍을 따라 kebob-case를 사용한다.
3. `src/setupTests.ts` 등 설정을 위해 존재하는 파일이 아닌 모든 파일 이름은 kebob-case를 사용한다.
4. 상수는 UPPER_SNAKE_CASE를 사용한다. 같은 성격을 가지는 변수여서 객체(`as const`)로 선언하거나 `enum`으로 선언하더라도 변수 이름도, 키값도 UPPER_SNAKE_CASE를 사용한다.
5. 타입은 PascalCase를 사용한다. interface의 merging 기능이나 계층을 포함하는 타입을 선언하는 것이 아니라면 `type`을 사용한다. `type`으로 선언한 타입은 접두사로 `T`를 붙인다. `interface`로 선언한 타입은 접두사로 `I`를 붙인다. 컴포넌트 인자 타입은 `TProps` 또는 `IProps`로 통일한다. 또한 타입을 import할 때는 `type` 키워드를 반드시 명시한다.
6. 타입 파일(`types.d.ts`)는 `@types` 디렉터리에 위치시킨다. 같은 도메인을 가지는 타입들을 선언한다. 다만 `TProps` / `IProps`나 특정 파일 내에서만 쓰는 타입들은 해당 파일 `import` 구문 바로 밑에 위치시킨다.
7. 이외의 모든 함수명과 변수는 camelCase를 사용한다.
8. Boolean 타입은 변수의 접두사로 `is` 또는 `are`을 사용한다.
9. Array 타입은 변수의 접미사로 복수를 의미할 수 있도록 `s` 또는 `ies` 등을 사용한다.
10. 함수와 메서드의 이름은 동사로 시작한다. 다른 변수의 이름은 동사로 시작하지 않는다.
11. hook은 접두사로 `use`를 사용하고 HoC는 접두사로 `with`를 사용한다.
12. `this` 바인딩이 필요한 경우나 메모이제이션 훅 등 arrow 함수가 특별히 필요한 경우가 아니라면 함수 선언은 `function` 키워드로 통일한다.
13. 컴포넌트 내부 선언 과정은 다음과 같다. `useState`, `useReducer`, `useDispatch` -> `useContext` -> `useRef` -> custom hook -> 일반 변수 -> `useLayoutEffect` -> `useEffect` -> 일반 함수 -> 바인딩 함수. 다만, 함수 간의 거리가 너무 멀어서 가독성이 해친다고 판단되면 일반 함수와 바인딩 함수의 선언 순서는 변경할 수 있다.
14. 웬만하면 default export 모듈 보다는 named export 모듈을 사용한다. 최근 번들러는 트리 쉐이킹이 둘 다 잘 지원되기 때문에 더 간결한 코드를 위해서이다.

아래는 컴포넌트 예시이다.

```tsx
// src/components/Button.tsx

import {ReactNode, type MouseEvent, useState, useReducer, useDispatch, useEffect} from "react";

type TProps = {
  disabled: boolean,
  children: React.ReactNode
  onClick: (event: React.MouseEvent)
}

export default function Button({disabled, children, onClick}: TProps) {
  const [indexes, setIndexes] = useState<number[]>([0])
  // useReducer
  // useDispatch
  // useCustomHook
  const IS_INDEXES_ZERO = indexes.every((index) => index === 0)

  useEffect(() => {
    // do something
  }, [])

  function count() {
    // do something
  }

  function handleIndex() {
    onClick()
    // do something
  }

  return (
    <button onClick={handleIndex} disabled={disabled}>
      {children}
    </button>
  )
}
```

## Style Sheet

1. CSS 방법론은 프로젝트마다 원하는 방향으로 가져간다. 하지만 많이 사용하는 `margin`, `display: flex`, `text-overflow: ellipsis` 등은 utility-first css(`src/assets/styles/utility-first.scss`)를 이용한다.
2. 색은 소문자 hex 값으로 표현한다. [3-digit으로 표현 가능한 경우](https://www.w3schools.com/css/css_colors_hex.asp) 3-digit으로 표현한다. 불가능하다면 6-digit으로 표현한다. 다만 rgba에서 alpha 값이 필요하다면 rgba를 사용한다.
3. 스타일 코드에서 스코프(`{}`) 사이에는 반드시 하나의 개행을 가진다.
4. 스타일 코드는 다음과 같은 순서대로 선언하고, 그룹화한다.

- 가상선택자 `::after`, `::before`에 대한 `content`
- 변수 선언
- mixin
- `display`와 `display` 설정으로 필요한 스타일 관련
- `margin`, `padding` 관련
- `position`과 `position` 설정으로 필요한 스타일 관련
- `width`,`height` 관련
- `font`, `text` 관련
- `background` 관련
- `border` 관련
- animation 관련
- 기타
- 가상 선택자
- 자식 선택자

```scss
/* 예를 들어 */
.parent {
  display: flex;
  justify-content: center;

  position: relative;

  color: #000;
  font-size: 18px;

  background-color: #abcdef;

  border: 1px solid black;

  &:hover {
    cursor: pointer;
  }

  .child {
    // something
  }
}
```

## 테스트 코드

1. 테스트 코드에는 반드시 "given", "when", "then"을 주석으로 작성한다.
2. `toBe`, `toEqual`은 의미상 하는 일이 동일하기 때문에 `toEqual`로 통일하여 작성한다.
3. 컴포넌트 테스트 시 특별한 경우가 아니라면 given은 다음과 같은 순서로 작성하며 개행으로 구분한다. 모킹 => 렌더링 => get / query / find element.
4. 불필요한(호출 여부 테스트하는 부분이 아닌 곳 등) `jest.fn()` 선언은 지양한다.

```tsx
// 예시
jest.mock("../../components/app", () => ({
  __esModule: true,
  WithoutSignUp: jest.fn(() => (
    <div data-testid="without-signup">WithoutSignUp Component</div>
  )),
}))

// 아래와 같은 방법으로 작성
jest.mock("../../components/app", () => ({
  __esModule: true,
  WithoutSignUp: () => (
    <div data-testid="without-signup">WithoutSignUp Component</div>
  ),
}))
```

## 기타

1. eslint는 [eslint-config-react-app](https://www.npmjs.com/package/eslint-config-react-app), [@typescript-eslint/eslint-plugin](https://www.npmjs.com/package/@typescript-eslint/eslint-plugin)를 참고한다.
2. `src/assets` 또는 `src/components`는 import, export 해야 하는 모듈들이 많기 때문에 [barrel](https://basarat.gitbook.io/typescript/main-1/barrel) 파일을 사용한다.
3. commit은 [udacity git commit convention](http://udacity.github.io/git-styleguide/)에 안 쓰는 코드 / 파일 삭제를 의미하는 "remove" type을 추가해서 사용한다. 다만 subject만으로 충분히 표현이 가능하거나 간단한 수정이면 body와 footer를 생략할 수 있다.
4. commit 시 바뀐 파일 이름을 추가한다(ex. fix: \~\~버그 수정(components/Loading)). 또한 "chore"를 사용하면 설치 또는 삭제한 모듈을 커밋 내용에 추가한다(ex. chore: CSS in JS로 변경(+ styled-components, - node-sass)).
5. git-hook으로 husky를 사용한다. pre-commit으로 `yarn lint` 명령어로 검사하고, pre-push로 `yarn test` 명령어로 검사한다.
6. 이미지는 용량이 작은 webp 포맷을 사용한다. 이미지 barrel 파일에서는 camelCase를 사용한다.
7. 아이콘은 사이즈가 커져도 깨지지 않는 svg 포맷을 사용한다. ~(디자이너가 없기 때문에 사이즈별로 아이콘 만들기 힘들다)~ 작은 크기 파일에 적합하지 않은 ico나 `img` 태그의 src 속성을 사용하는 png(적용할 수 있는 css가 더 적음)는 사용을 지양한다. barrel 파일에서는 PascalCase를 사용한다.

## 프로젝트 구조

\[X]는 적당한 예제 파일이 없어서 git에 올라가지 않은 폴더이다.
a

```
.
├── .husky                  # git hooks
├── .yarn                   # node modules
├── public                  # 서버 외부에서 public하게 접근할 수 있는 파일들
├── src
    ├── [X] __mocks__       # 테스트를 위한 목업
    ├── __tests__           # 테스트 파일. 폴더 내부는 src와 같은 구조를 가짐
    ├── @types              # 파일 이름은 ${도메인}.d.ts로 설정
    ├── api                 # API 요청과 관련된 내용
    ├── assets
        ├── fonts           # 배달의 민족에서 다운로드함
        ├── icons           # barrel 파일로 관리. svgrepo 에서 다운로드함. 컴포넌트처럼 JSX 문법을 이용함. namespace 에러 발생할 시 https://stackoverflow.com/questions/59820954/syntaxerror-unknown-namespace-tags-are-not-supported-by-default 참고
        ├── images          # barrel 파일로 관리
        ├── styles          # 브랜드 컬러 / 시스템 컬러는 리메인을 참고함
    ├── [X] components      # 폴더 내부는 pages와 같은 구조를 가짐. 공통 컴포넌트는 components 폴더 바로 아래에서 관리. 컴파운드 컴포넌트는 __compounds__ 하위에 선언
    ├── constants           # 여러 컴포넌트에서 사용하고 props로 전달하기 애매한 상수들. 파일 이름은 도메인으로 설정
    ├── hooks               # 공통적으로 사용되는 추상화된 로직
    ├── pages               # 각 route별 최상단 컴포넌트
    ├── routes              # 라우팅 처리 관련 내용
    ├── store               # 상태 관리
    ├── utils               # 훅을 사용하지 않는 함수(ex. 포맷팅)
├── README.md
├── ...some config files
```
