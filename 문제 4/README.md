# 문제 4

아래의 요구조건에 맞는 설계를 진행하고, 이유를 설명해주세요

작은 스타트업에서 BO 서비스에서 통계 서비스를 개발하여 합니다

1. 각 콘텐츠의 유저의 클릭수, 좋아요수를 보여주는 그래프를 그려야 합니다
2. 클릭과 좋아요 수는 BO의 대시보드에서 확인이 가능하며, 새로고침 버튼을 눌러서 갱신 가능합니다
3. 그래프는 일일 단위로 합계로 표시됩니다

## 설계 결과

```sql
    CREATE TABLE users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL
    );

    CREATE TABLE content (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        body TEXT NOT NULL,
    );

    CREATE TABLE click (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        content_id INT NOT NULL,
        clicked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE (user_id, content_id), -- 유저당 한번씩만 기록한다
        FOREIGN KEY (content_id) REFERENCES content(id) ON DELETE CASCADE
    );


    CREATE TABLE like (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        content_id INT NOT NULL,
        liked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE (user_id, content_id), -- 유저당 한번씩만 기록한다
        FOREIGN KEY (content_id) REFERENCES content(id) ON DELETE CASCADE
    );

    CREATE TABLE stats (
        id INT PRIMARY KEY AUTO_INCREMENT,
        content_id INT NOT NULL,
        stat_date DATE NOT NULL,
        total_clicks INT DEFAULT 0,
        total_likes INT DEFAULT 0,
        UNIQUE (content_id, stat_date),
        FOREIGN KEY (content_id) REFERENCES content(id) ON DELETE CASCADE
    );
```

---

### 💡 추가질문 1. - 실제로 구현해본 경험이 있다면, 해당 구현 경험을 서술해주세요

-   Express.js, TypeORM, PostgrSQL으로 구축했습니다.
-   like/view Table 구성 시, TypeORM에서 M:N 릴레이션 구성 했습니다.
    -   자동으로 생성되는 조인 테이블에 create_at과 같은 컬럼을 추가했어야 하는데 커스텀해서 사용해야 했습니다.
    -   좋아요와 방문자 수는 유저당 하나씩으로 제한을두었습니다.

### 💡 추가질문 2. - 유저가 클릭을 조작하기위해 빠르게 연타를 한다면, 어떻게 방지할수 있을까요?

-   클릭에 대한 디바운싱 or 쓰로틀링을 적용 합니다.
-   좋아요를 빠르게 연타할 경우 DB 스키마 설계에서부터 회원당 한 게시글에 하나의 좋아요를 할 수 있도록 설계합니다.
-   클릭수는 회원만 체크할 경우 회원당 하나, 비회원도 체크한다면 아이피와 매 초당 한번씩만 할 수 있도록 설계합니다.
